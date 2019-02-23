/* @flow */
/* eslint-disable no-console */

import {readFile, replaceJs, Stepper, step, withJsFile} from '@dubstep/core';
import * as awdClient from '@uber/awd-client';
import {checkGitRepository} from '../utils/check-git-repository.js';
import {checkServiceDirectory} from '../utils/check-service-directory.js';
import get from 'just-safe-get';
import path from 'path';
import {promptChoice} from '../utils/prompt-choice.js';
import {prompt} from '../utils/prompt.js';

// TODO: Should pull from Infraportal configs instead of hard coding in case available zones changes
// Not a super high priority since this happens infrequently
const VALID_DCS = ['phx2', 'irn1', 'dca1', 'dca4'];

type ProvisionOptions = {
  infraportalConfig: {
    conduitToken: string,
    repo: string,
    serviceTier: number,
    team: string,
    usentryTeam: string,
    zones: Array<string>,
  },
  pathfinderConfig: {
    domain: string,
    subdomain: string,
  },
  serviceName: string,
  trafficControllerConfig: {
    configDir: string,
  },
};

export const provision = async () => {
  // eslint-disable-next-line no-constant-condition
  if (true) {
    return console.log(
      `Automated provisioning is currently disabled. ` +
        `Please visit the Web Platform Team's documentation on ` +
        `how to provision and deploy your project: ` +
        `https://engdocs.uberinternal.com/web/docs/getting-started/provision-and-deploy`
    );
  }

  const options: ProvisionOptions = {
    infraportalConfig: {
      conduitToken: '',
      repo: '',
      serviceTier: 5,
      team: '',
      usentryTeam: '',
      zones: [],
    },
    pathfinderConfig: {
      domain: '',
      subdomain: '',
    },
    serviceName: '',
    trafficControllerConfig: {
      configDir: '',
    },
  };

  let awdToken = '';

  const stepper = new Stepper([
    step('Precheck - Git and service directory', async () => {
      console.log('Now checking service directory status...');
      await checkGitRepository();
      options.serviceName = await checkServiceDirectory();
      console.log(`Your service name is: ${options.serviceName}\n`);
    }),
    step('Verify local AWD token exists', async () => {
      let token = await awdClient.getToken();
      if (!token) {
        console.log('Verifying OpenID token for AWD...');
        console.log('No valid token found.');
        token = await validateAwdTokenFlow();
        await awdClient.persistToken(token);
      }
      awdToken = token;
    }),
    step('Verify Sentry DSN', async () => {
      const sentryConfig = await readFile(
        process.cwd() + '/src/config/sentry.js'
      ).catch(() => '');
      // Look for the existance of a proper sentry DSN
      const sentryDsn = sentryConfig.match(
        /(https?:\/\/.*@usentry.local.uber.internal.*)/
      );
      if (!sentryDsn) {
        const success = await createSentryDSN(awdToken);
        if (success) {
          // Exit prematurely since the user needs to commit and push the DSN
          process.exit();
        } else {
          throw new Error(
            'There was an error while attempting to create a new uSentry project. Please try again.'
          );
        }
      }
    }),
    step('Provisioning status check', async () => {
      console.log('Checking on any existing provisions...');
      try {
        const {data, status} = await awdClient.checkProgress(
          awdToken,
          options.serviceName
        );
        if (status === awdClient.STATUS_IN_PROGRESS) {
          printStatusReport(data);
          process.exit();
        }
        console.log('No in progress provisions detected.');
      } catch (e) {
        console.log(e);
        throw new Error('Could not reach AWD. Please try again.');
      }
    }),
    step('Pathfinder configuration', async () => {
      Object.assign(options.pathfinderConfig, await validateServiceUrlFlow());
    }),
    step('Infraportal configuration - Repository link', async () => {
      const packageJson = JSON.parse(
        await readFile(process.cwd() + '/package.json').catch(() => '{}')
      );
      const url = get(packageJson, 'repository.url');
      if (!url) {
        throw new Error('Repository URL was missing in package.json.');
      }
      options.infraportalConfig.repo = packageJson.repository.url;
    }),
    step('Infraportal configuration - Conduit token', async () => {
      const arcConfig = JSON.parse(
        // $FlowFixMe - Ignore warning about process.env.HOME
        await readFile(path.join(process.env.HOME, '.arcrc')).catch(() => '{}')
      );
      const conduitToken = get(arcConfig, [
        'hosts',
        'https://code.uberinternal.com/api/',
        'token',
      ]);
      if (!conduitToken) {
        throw new Error('conduitToken was missing from your .arcconfig file.');
      }
      options.infraportalConfig.conduitToken = conduitToken;
    }),
    step('Infraportal configuration - uBlame team', async () => {
      console.log('Fetching uBlame teams...');
      options.infraportalConfig.team = await promptChoice(
        'What is the uBlame team responsible for this service?',
        await awdClient.getUBlameTeams(awdToken)
      );
    }),
    step('Infraportal configuration - Service tier', async () => {
      options.infraportalConfig.serviceTier = await promptChoice(
        'What service tier is your service?',
        ['3', '4', '5']
      );
    }),
    step('Infraportal configuration - Datacenters', async () => {
      options.infraportalConfig.zones = await infraZoneFlow();
    }),
    step(
      'Traffic controller configuration - rINCONF config directory',
      async () => {
        console.log(
          '\nIn order to set up routing, a traffic controller configuration will need to be written to the rINCONF repository.'
        );
        console.log(
          'Traffic controller needs the directory name in order to save the configuration. Browse the rINCONF repo to find the appropriate namespace for your web application.'
        );
        console.log(
          'Link to repo: https://code.uberinternal.com/diffusion/INCONF/browse/master/net/traffic'
        );
        options.trafficControllerConfig.configDir = await prompt(
          'What is the directory name within the rINCONF repo? (e.g. infra and NOT net/traffic/infra/config.yaml)'
        );
      }
    ),
    step('Send request to AWD', async () => {
      // console.log('options to send to awd are', options);
      await awdClient.start(options);
    }),
  ]);
  await stepper.run().catch(e => {
    if (e instanceof Error) {
      console.log(`An error occurred while provisioning: ${e.message}`);
    }
  });
};

async function createSentryDSN(awdToken: string): Promise<boolean> {
  console.log(
    'No Sentry DSN was found in src/config/sentry.js. A Sentry DSN is required for provisioning.'
  );
  console.log("Let's create one now.");
  console.log('Fetching uSentry teams...');

  // Create the data
  const allUSentryTeams = await awdClient.getUSentryTeams(awdToken);
  const uSentryTeamsByName = allUSentryTeams.reduce(
    (accumulator: Object, data: Object) => {
      accumulator[data.name] = data.value;
      return accumulator;
    },
    {}
  );

  const uSentryTeamName = await promptChoice(
    'What uSentry team does your service fall under?',
    allUSentryTeams.map((data: Object) => data.name)
  );
  const uSentryTeamValue = uSentryTeamsByName[uSentryTeamName];
  const projectDisplayName = await prompt(
    'What is your project display name? (can contain capital letters and/or spaces)'
  );

  let createdDsn = '';
  try {
    createdDsn = await awdClient.createUSentryTeam(
      awdToken,
      uSentryTeamValue,
      projectDisplayName
    );
    console.log(`\nA new DSN was created for your project: ${createdDsn}`);
  } catch (e) {
    if (e.statusCode && e.statusCode === 409) {
      // TODO: Currently uSentry sometimes returns a 409 even though the DSN's were successfully created
      // The team is looking into it but in the meantime, if we get a conflict, check if the response actually includes
      // any DSN's and if so, use them
      let returnWithFail = true;
      if (e.error) {
        const dsn = get(e.error, 'dca1.dsn');
        if (dsn) {
          createdDsn = dsn;
          console.log(
            `\nA new DSN was created for your project: ${createdDsn}`
          );
          returnWithFail = false;
        }
      }

      if (returnWithFail) {
        console.log(
          'That project already exists. If it is your project, visit https://infra.uberinternal.com/usentry/manage to find the DSN and copy it into src/config/sentry.js.'
        );
        return false;
      }
    } else {
      return false;
    }
  }

  // Replace the default DSN in config/sentry.js
  await withJsFile(
    path.join(process.cwd(), 'src', 'config', 'sentry.js'),
    p => {
      return new Promise(resolve => {
        resolve(
          replaceJs(
            p,
            `export default { id: 'Sentry project DSN goes here' };`,
            `export default { id: '${createdDsn}' };`
          )
        );
      });
    }
  );

  console.log(
    'src/config/sentry.js was modified with the new DSN. Please commit the change and push before retrying provisioning again.'
  );
  return true;
}

async function validateAwdTokenFlow(): Promise<string> {
  const token = await prompt(
    `Please copy and paste the token from ${awdClient.AWD_TOKEN_URL} here:`
  );
  const verification = await awdClient.verifyToken(token);
  if (verification) {
    return token;
  } else {
    console.log(
      'Invalid token. Please ensure that you copied and pasted the token correctly.'
    );
    return await validateAwdTokenFlow();
  }
}

async function validateServiceUrlFlow(): Promise<Object> {
  const serviceUrl = await prompt(
    'What is the desired URL of your web service? (e.g. https://service.uber.com or https://service.uberinternal.com)'
  );
  const matchGroups = serviceUrl.match(
    /^https?:\/\/(\S*)\.(uber\.com|uberinternal\.com)$/
  );
  if (!matchGroups) {
    console.log(
      'Invalid URL. Make sure it matches an Uber-style URL (e.g. https://service.uber.com or https://service.uberinternal.com).'
    );
    return await validateServiceUrlFlow();
  } else {
    return {
      domain: matchGroups[2],
      subdomain: matchGroups[1],
    };
  }
}

async function infraZoneFlow(): Promise<Array<string>> {
  console.log(
    '\nEnter as a comma separated list which zones to instantiate Mesos instances.'
  );
  console.log('Available zones to create instances are: ', VALID_DCS);
  console.log(
    'Note that only 1 instance will be created in the specified zones. You are also limited to 2 zones max per instance while your service is in the prototype phase.'
  );
  console.log('If you are unsure, specify "phx2, dca1".');
  const zones = await prompt(
    'Which zones do you want to create new instances?'
  );

  // Validate
  if (!zones) {
    return await infraZoneFlow();
  }
  const splitZones = zones.split(',');
  console.log(splitZones);
  for (let i = 0; i < splitZones.length; i++) {
    if (!VALID_DCS.includes(splitZones[i])) {
      return await infraZoneFlow();
    }
  }

  return zones.split(',');
}

function printStatusReport(data: Object[]) {
  console.log('Your service is currently being provisioned.\n');

  if (data.length === 0) {
    return;
  }

  // Data is the raw response from AWD so we need to massage it a little bit to get it in the right
  // table format
  const augmentedData = data.map((blob: Object) => {
    return {
      'Task Name': blob.taskName,
      Completed: blob.completed,
      Status: blob.status,
      'Current Step': get(blob, 'message.step') || 'N/A',
      'Step %':
        get(blob, 'message.progress') != undefined
          ? get(blob, 'message.progress') + '%'
          : 'N/A',
    };
  });

  const nodeVersionMatch = process.version.match(/v(\d+)\./);
  // Use console.table since it exists
  if (nodeVersionMatch && Number(nodeVersionMatch[1]) >= 10) {
    return console.table(augmentedData);
  }

  // Manually console log as an ugly table
  console.log(Object.keys(augmentedData[0]).join('  |  ') + '\n');
  augmentedData.forEach((row: Object) => {
    console.log(
      [
        row['Task Name'],
        row['Completed'],
        row['Status'],
        row['Current Step'],
        row['Step %'],
      ].join('  |  ') + '\n'
    );
  });
}
