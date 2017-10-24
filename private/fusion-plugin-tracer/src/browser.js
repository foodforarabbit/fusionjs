/* eslint-env browser */

export default function() {
  if (__DEV__) {
    throw Error(
      '[Graphene] Tracer Client is a node library, please do not include it on the browser'
    );
  }
}
