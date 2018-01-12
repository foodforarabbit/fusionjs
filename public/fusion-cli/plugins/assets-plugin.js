//@flow
/* eslint-env node */
const envVarsPlugin = require('./environment-variables-plugin');

const path = require('path');
const mount = require('koa-mount');
const serve = require('koa-static');

module.exports = function(dir /* : string */) {
  const {assetPath, env} = envVarsPlugin().of();
  // setting defer here tells the `serve` middleware to `await next` first before
  // setting the response. This allows composition with user middleware
  return mount(
    assetPath,
    serve(path.resolve(dir, `.fusion/dist/${env}/client`), {defer: true})
  );
};
