// @flow
function safeJSONStringify(stuff: any): string {
  try {
    return JSON.stringify(stuff || '');
  } catch (e) {
    return '';
  }
}

function safeJSONParse(str?: string): ?Object {
  try {
    return JSON.parse(str || '') || null;
  } catch (e) {
    return null;
  }
}

export {safeJSONStringify, safeJSONParse};
