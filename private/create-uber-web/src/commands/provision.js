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
import Table from 'cli-table3';

// TODO: Should pull from Infraportal configs instead of hard coding in case available zones change
// See: mesos_cluster_host, auth, and deprecated_zones config keys for latest values
const VALID_DCS = ['phx3', 'irn1', 'dca1', 'dca4'];

type ProvisionOptions = {
  infraportalConfig: {
    conduitToken: string,
    repo: string,
    serviceTier: number,
    team: string,
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
  const options: ProvisionOptions = {
    infraportalConfig: {
      conduitToken: '',
      repo: '',
      serviceTier: 5,
      team: '',
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
    step('Verify Healthline DSN', async () => {
      const sentryConfig = await readFile(
        process.cwd() + '/src/config/sentry.js'
      ).catch(() => '');

      // Old scaffolded apps have no DSN at all and had placeholder text
      const noDsn = sentryConfig.match(/Sentry project DSN goes here/);
      if (noDsn) {
        const success = await createSentryDSN(options.serviceName);
        if (success) {
          // Exit prematurely since the user needs to commit and push the DSN
          process.exit();
        } else {
          throw new Error(
            'There was an error while attempting to create a new DSN. Please try again.'
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
        } else if (status === awdClient.STATUS_PAUSED) {
          const canUnPause = await prompt(
            'Provisioning has been paused. Have you taken the steps to unpause? [y/n]'
          );
          if (canUnPause !== 'y') {
            process.exit();
          }
        } else if (status === awdClient.STATUS_COMPLETED) {
          console.log('Provisioning has been completed.');
          process.exit();
        } else if (status === awdClient.STATUS_DISABLED) {
          console.log(
            `Automated provisioning is currently disabled. ` +
              `Please visit the Web Platform Team's documentation on ` +
              `how to provision and deploy your project: ` +
              `https://engdocs.uberinternal.com/web/docs/getting-started/provision-and-deploy`
          );
          process.exit();
        } else {
          console.log('No in progress provisions detected.');
        }
      } catch (e) {
        console.log(e);
        throw new Error('Could not reach AWD. Please try again.');
      }
    }),
    step('Intro message to user', async () => {
      console.log(`
INFORMATION:
  * This command should be run from within the root directory of the service you wish to provision.
  * Provisioning will create docker instances, build and deploy your code on uDeploy, set up
    associated traffic groups and endpoints to route to your application, and set up uMonitor.
  * This process will collect information upfront, then work in the background. Expect this to take
    about an hour, possibly longer.
  * Provisioning may pause at certain points. Follow the directions sent to you to get the process
    unpaused.
  * You may re-run 'uber-web provision' at any time to check on the status of your provisioning.

LIMITATIONS:
  * Only tier 3-5 services are supported using this tool. If you require a more critical tier,
    you will need ERD and SRE approval and need to manually provision.
  * Only 1 machine is provisioned per zone by default. A maximum of 2 per zone is available for
    services in the prototype stage. You can adjust this post provision within Infraportal.
  * Breeze integration for external sites is not supported. If you require onboarding visit
    https://engdocs.uberinternal.com/arch/onboarding.html and manually configure within Pathfinder.
`);
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
      const conduitToken = get<string>(arcConfig, [
        'hosts',
        'https://code.uberinternal.com/api/',
        'token',
      ]);
      if (!conduitToken) {
        throw new Error('conduitToken was missing from your .arcconfig file.');
      }
      options.infraportalConfig.conduitToken = conduitToken;
    }),
    step('Infraportal configuration - uOwn team', async () => {
      console.log('Fetching uOwn teams...');
      const teams = await awdClient.getUBlameTeams(awdToken);

      if (!teams || (Array.isArray(teams) && teams.length === 0)) {
        console.log(`
No uOwn teams were returned. Check the following:
1) Ensure you have Manage permissions in any uOwn groups
2) Ensure you a member of the Pullo group corresponding to those uOwn groups
        `);
        process.exit();
      }
      options.infraportalConfig.team = await promptChoice(
        'What is the uOwn team responsible for this service? (see http://t.uber.com/p_uown if your team is missing)',
        teams
      );
    }),
    step('Infraportal configuration - Service tier', async () => {
      options.infraportalConfig.serviceTier = await promptChoice(
        'What service tier is your web application?',
        ['3', '4', '5']
      );
    }),
    step('Infraportal configuration - Datacenters', async () => {
      options.infraportalConfig.zones = await infraZoneFlow();
    }),
    step(
      'Traffic controller configuration - rINCONF config directory',
      async () => {
        console.log(`
\nIn order to set up routing, a traffic controller configuration will need to be written to the
rINCONF repository.

Traffic controller needs the directory name in order to save the configuration. Browse the rINCONF
repo to find the appropriate namespace for your web application.

Link to repo: https://code.uberinternal.com/diffusion/INCONF/browse/master/net/traffic
`);
        options.trafficControllerConfig.configDir = await prompt(
          'What is the directory name within the rINCONF repo? (e.g. infra and NOT net/traffic/infra/config.yaml)'
        );
      }
    ),
    step('Send request to AWD', async () => {
      // console.log('options to send to awd are', options);
      await awdClient.start(awdToken, options);
      console.log(
        'Provisioning is now underway. Check the status at any time by invoking the provision command.'
      );
    }),
  ]);
  await stepper.run().catch(e => {
    if (e instanceof Error) {
      console.log(`An error occurred while provisioning: ${e.message}`);
    }
  });
};

async function createSentryDSN(serviceName: string): Promise<boolean> {
  console.log(
    'No Sentry DSN was found in src/config/sentry.js. Generating one now.'
  );

  // Replace the default DSN in config/sentry.js
  await withJsFile(
    path.join(process.cwd(), 'src', 'config', 'sentry.js'),
    async p => {
      replaceJs(
        p,
        `export default { id: 'Sentry project DSN goes here' };`,
        `export default { id: 'http://uber:uber@usentry.local.uber.internal/${serviceName}' };`
      );
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
  console.log(`
\nEnter as a comma separated list which zones to instantiate Mesos instances.
Available zones to create instances are: ${VALID_DCS.join(', ')}

Note that only 1 instance will be created in the specified zones. You are also limited to 2 zones
max per instance while your service is in the prototype phase.
  `);
  let zones = await prompt(
    'Which zones do you want to create new instances? (phx3, dca4)'
  );

  // Validate
  if (!zones) {
    zones = 'phx3, dca4';
    console.log('phx3 and dca4 selected as the default.');
  }
  const splitZones = zones.split(',').map(zone => zone.trim());

  for (let i = 0; i < splitZones.length; i++) {
    if (!VALID_DCS.includes(splitZones[i])) {
      return await infraZoneFlow();
    }
  }

  return splitZones;
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
          ? get<string>(blob, 'message.progress') + '%'
          : 'N/A',
    };
  });

  const table = new Table({
    head: ['Task Name', 'Completed', 'Status', 'Current Step', 'Step %'],
  });

  augmentedData.forEach((row: Object) => {
    table.push([
      row['Task Name'],
      row['Completed'],
      row['Status'],
      row['Current Step'],
      row['Step %'],
    ]);
  });

  console.log(table.toString());
}
