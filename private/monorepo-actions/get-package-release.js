// @flow
const {exec, readFile} = require('@dubstep/core');
const TOML = require('@iarna/toml');

/*::
type ReleaseInfo = {
  packages: Packages,
  releases: Array<Release>
}

type Packages = {
  [string]: {
    [string]: Release
  }
}

type Release = {
  date: Date,
  name: string,
  tag: string
}
*/

(async () => {
  const [, , name, version] = process.argv;
  const {packages} = await getReleaseInfo();
  if (version === 'latest') {
    const latestVersion = await exec(`npm info ${name} version`);
    // eslint-disable-next-line no-console
    console.log(packages[name][latestVersion].tag);
  } else {
    // eslint-disable-next-line no-console
    console.log(packages[name][version].tag);
  }
})();

async function getReleaseInfo() /*: Promise<ReleaseInfo> */ {
  const releases = await getReleases();
  return {
    packages: await getPackages(releases),
    releases,
  };
};

async function getPackages(releases /*: Array<Release> */) /*: Packages */ {
  const packages = {};
  for (const release of releases) {
    const meta = TOML.parse(
      await readFile(`../../.publisher/releases/${release.name}/release.toml`)
    );
    Object.keys(meta).forEach(pkg => {
      if (!Object.keys(packages).includes(pkg)) {
        packages[pkg] = {};
      }
      packages[pkg][meta[pkg].version] = release;
    });
  }
  return packages;
}

async function getReleases() /*: Promise<Array<Release>> */ {
  await exec(`git fetch --tags`);
  const tags = await exec(`git tag --list`);
  return tags.split('\n').map(t => {
    const [, yearMonthDay, hourMinSec, name] = t.split('/');
    const [year, month, day] = yearMonthDay.split('-').map(_ => Number(_));
    const hour = Number(hourMinSec.slice(0, 2));
    const min = Number(hourMinSec.slice(2, 4));
    const sec = Number(hourMinSec.slice(4, 6));
    return {
      date: new Date(year, month - 1, day, hour, min, sec),
      name: name,
      tag: t,
    };
  });
}



