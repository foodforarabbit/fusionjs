// @flow
const sentryId = __NODE__ ? process.env.UBER_DATACENTER || 'local' : '<TODO>';

if (sentryId === '') {
  throw new Error('Sentry Id not found in src/config/sentry.js');
}

export default {
  id: `http://uber:uber@healthline-production.${sentryId}.uber.internal/{{name}}`,
};
