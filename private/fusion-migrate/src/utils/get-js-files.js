const {findFiles} = require('@dubstep/core');

module.exports = async function getJSFiles() {
  const files = await findFiles('src/**/*.js');
  return files;
};
