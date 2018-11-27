// @flow
/* eslint-env node */
function addSourcesToDirective(policy: any, directive: any, sources: any) {
  if (policy[directive] && policy[directive][0] !== "'none'") {
    policy[directive] = policy[directive].concat(sources);
  } else {
    policy[directive] = sources;
  }
  return policy;
}

function addDirectives(policy: any, directives: any) {
  return Object.keys(directives).reduce(function perDirectiveKey(
    p,
    directiveKey
  ) {
    return addSourcesToDirective(p, directiveKey, directives[directiveKey]);
  },
  policy);
}

export {addDirectives, addSourcesToDirective};
