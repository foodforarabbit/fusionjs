/*
usage:
  const migrate = require('../utils/plugin-to-di-standalone');

  module.exports = compose(
    migrate('FooPlugin'), // app.plugin(FooPlugin) -> app.register(FooPlugin)
    migrate('Foo') // app.plugin(Foo) -> app.register(Foo)
  );
*/
module.exports = (...transforms) => (file, api, options) => {
  return transforms.reduce((source, transform) => {
    return transform({...file, source}, api, options);
  }, file.source);
};
