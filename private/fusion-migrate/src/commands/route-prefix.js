const fs = require('fs');
const path = require('path');

module.exports = function updateDeps({destDir, routePrefix}) {
  const destPackagePath = path.join(destDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());

  const oldDev = destPackage.scripts.dev;
  const oldStart = destPackage.scripts.start;

  if (routePrefix && routePrefix !== '/') {
    destPackage.scripts.dev = `ROUTE_PREFIX=${routePrefix} ${oldDev}`;
    destPackage.scripts.start = `ROUTE_PREFIX=${routePrefix} ${oldStart}`;
  }

  fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2));
};
