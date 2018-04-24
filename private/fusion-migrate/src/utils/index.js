const babylon = require('babylon');
const t = require('@babel/types');
const parserOpts = require('../parser-opts.js');

let cache = {};

function get(obj, fn, val) {
  try {
    return fn(obj);
  } catch (e) {
    return val;
  }
}

function matchStatement(path, code, matchingOptions) {
  return matchTree(path.node, astOf(code), matchingOptions);
}
function matchExpression(path, code, matchingOptions) {
  return matchTree(path.node, astOf(code).expression, matchingOptions);
}
function matchTree(a, b, matchingOptions) {
  const {shallow} = matchingOptions || {};
  if (!b) {
    if (shallow) return true;
    else return false;
  }
  if (a.type !== b.type) return false;
  for (const key in a) {
    if (key.match(/start|end|loc|importKind|comment/i)) continue;
    else if (Array.isArray(a[key])) {
      if (!Array.isArray(b[key])) return false;
      for (let i = 0; i < a[key].length; i++) {
        const matched = matchTree(a[key][i], b[key][i], matchingOptions);
        if (!matched) return false;
      }
    } else if (a[key] instanceof Object) {
      const matched = matchTree(a[key], b[key], matchingOptions);
      if (!matched) return false;
    } else if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}
function clearMatchCache() {
  cache = {};
}

function astOf(code) {
  if (cache[code]) return cache[code];
  cache[code] = babylon.parse(code, parserOpts).program.body[0];
  return cache[code];
}

function addImportSpecifier(path, local, imported = local) {
  const localId = t.identifier(local);
  const importedId = t.identifier(imported);
  const specifier = t.importSpecifier(localId, importedId);
  path.node.specifiers.push(specifier);
}
function addStatementAfter(path, code) {
  path.insertAfter(astOf(code));
}
function replaceExpression(path, code) {
  path.replaceWith(astOf(code).expression);
}

module.exports = {
  get,
  astOf,
  matchStatement,
  matchExpression,
  clearMatchCache,
  addImportSpecifier,
  addStatementAfter,
  replaceExpression,
};
