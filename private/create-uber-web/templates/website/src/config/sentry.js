// @flow
export default (zone: string) => ({
  id:
    `http://uber:uber@healthline-production.${zone}.uber.internal/{{name}}`,
});
