// @flow
const sentryEnv = __NODE__ ? process.env.UBER_DATACENTER || 'local' : 'local';

export default {
  id: `http://uber:uber@healthline-production.${sentryEnv}.uber.internal/{{name}}`,
};
