const semver = require('semver');
const path = require('path');
const fs = require('fs');

module.exports = function checkMigrationVersion(dir) {
  const packageDir = path.join(dir, 'package.json');
  if (!fs.existsSync(packageDir)) {
    return {
      error:
        'Could not find a project to migrate. Please run in a directory with a package.json',
    };
  }
  const packageJSON = JSON.parse(fs.readFileSync(packageDir).toString());
  const deps = packageJSON.dependencies || {};
  const bedrockVersion = deps['@uber/bedrock'];
  if (!bedrockVersion) {
    return {
      error:
        '@uber/bedrock is not in your package.json dependencies. Unsure of how to migrate this project',
    };
  }
  const cleanedVersion = semver.coerce(bedrockVersion).version;
  if (semver.gte(cleanedVersion, '14.0.0')) {
    return {
      version: 14,
    };
  } else if (semver.gte(cleanedVersion, '13.0.0')) {
    return {
      version: 13,
    };
  } else {
    return {
      error:
        'Automatic migrations is not supported for bedrock apps on versions < 13.x',
    };
  }
};
