// @flow
/* eslint-env node */
function addSourcesToDirective(
  policy: Object,
  directive: string,
  sources: [string]
) {
  if (policy[directive] && policy[directive][0] !== "'none'") {
    policy[directive] = policy[directive].concat(sources);
  } else {
    policy[directive] = sources;
  }
  return policy;
}

function addDirectives(policy: Object, directives: Object) {
  return Object.keys(directives).reduce(function perDirectiveKey(
    p,
    directiveKey
  ) {
    return addSourcesToDirective(p, directiveKey, directives[directiveKey]);
  },
  policy);
}

export {addDirectives, addSourcesToDirective};
