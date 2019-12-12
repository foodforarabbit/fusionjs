// @flow

export function ensureFlowComment(code: string) {
  if (!code) return code;
  if (code.includes('@noflow')) return code;
  if (!code.includes('@flow')) {
    code = code.replace(/^/, '// @flow\n');
  }
  return code;
}
