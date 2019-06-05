// @flow
// TODO: Should this be a separate library?
export function snakeCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/([A-Z0-9]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([0-9])([^0-9A-Z])/g, '$1-$2')
    .replace(/([^0-9A-Z])([0-9])/g, '$1-$2')
    .replace(/-+/g, '_')
    .toLowerCase();
}
