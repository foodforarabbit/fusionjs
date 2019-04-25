// @flow
export default {
  id: __NODE__ && `http://uber:uber@healthline-production.${process.env.UBER_DATACENTER || 'local'}.uber.internal/{{name}}`,
}
