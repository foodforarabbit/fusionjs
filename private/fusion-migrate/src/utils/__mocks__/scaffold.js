const tmp = require('tmp');

module.exports = async function mockScaffold() {
  return tmp.dirSync().name;
};
