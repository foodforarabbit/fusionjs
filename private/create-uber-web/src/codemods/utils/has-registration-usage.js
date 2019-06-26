// @flow

/**
 * Determines whether there are any usages of the provided identifier within
 * an `app.register(...)`
 */
export default function hasRegistrationUsage(
  program: any,
  identifier: string
): boolean {
  let found = false;
  program.traverse({
    ExpressionStatement(path) {
      path.traverse({
        CallExpression(path) {
          let isRegisterCall = false;
          if (
            path.node.callee.object &&
            path.node.callee.object.name === 'app' &&
            path.node.callee.property.name === 'register'
          ) {
            isRegisterCall = true;
          }

          // Exit early if this is not an 'app.register' call
          if (isRegisterCall) {
            path.traverse({
              Identifier(path) {
                if (path.node.name === identifier) {
                  found = true;
                }
              },
            });
          }
        },
      });
    },
  });
  return found;
}
