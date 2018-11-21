// @flow
function safeJSONStringify(stuff: any): string {
  try {
    return JSON.stringify(stuff || '');
  } catch (e) {
    return '';
  }
}

function safeJSONParse(str?: string): Object {
  try {
    return JSON.parse(str || '') || {};
  } catch (e) {
    return {};
  }
}

export {safeJSONStringify, safeJSONParse};
