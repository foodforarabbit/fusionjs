// @flow
/* eslint-env node */
module.exports = {
  client: {
    // or a local generated schema file
    service: {
      name: '{{name}}',
      // this is the default endpoint info
      endpoint: {
        url: 'https://localhost:3000/graphql',
      },
      localSchemaFile: './.graphql/schema.json',
    },
  },
};
