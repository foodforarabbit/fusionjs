/* eslint-env browser */

export default function() {
  if (__DEV__) {
    throw new Error(
      '[Graphene] Galileo is a node library, please do not include it on the browser'
    );
  }
}
