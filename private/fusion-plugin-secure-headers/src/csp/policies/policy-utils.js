/* eslint-env node */
const ASSET_DIRECTIVES = [
  'fontSrc',
  'imgSrc',
  'scriptSrc',
  'styleSrc',
  'mediaSrc',
];

function stripTrailingSlash(s) {
  if (
    s &&
    typeof s === 'string' &&
    s.length > 0 &&
    s.charAt(s.length - 1) === '/'
  ) {
    return s.substr(0, s.length - 1);
  }
  return s;
}

function stripLeadingSlashes(s) {
  if (s && typeof s === 'string' && s.length > 0 && s.indexOf('//') === 0) {
    return s.substr(2);
  }
  return s;
}

function addSourceToAssetDirectives(policy, source) {
  const cleanedSource = stripLeadingSlashes(stripTrailingSlash(source));

  return ASSET_DIRECTIVES.reduce(function addAssetSource(p, directive) {
    return addSourcesToDirective(p, directive, cleanedSource);
  }, policy);
}

function addSourcesToDirective(policy, directive, sources) {
  if (policy[directive] && policy[directive][0] !== "'none'") {
    policy[directive] = policy[directive].concat(sources);
  } else {
    policy[directive] = sources;
  }
  return policy;
}

function addDirectives(policy, directives) {
  return Object.keys(directives).reduce(function perDirectiveKey(
    p,
    directiveKey
  ) {
    return addSourcesToDirective(p, directiveKey, directives[directiveKey]);
  }, policy);
}

export {addDirectives, addSourcesToDirective, addSourceToAssetDirectives};
