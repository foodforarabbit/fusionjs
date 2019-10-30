// @flow
/* eslint-env node */
export default function UberDefault(nonce: string) {
  return {
    blockAllMixedContent: true, // Block loading of insecure resources
    frameSrc: ["'self'"], // frame, IFrame
    workerSrc: ["'self'"], // Worker, SharedWorker, or ServiceWorker scripts
    childSrc: ["'self'"], // deprecated in CSP v3 in favor for frame-src and worker-src
    connectSrc: ["'self'"], // XHR, WebSockets, etc.
    manifestSrc: ["'self'"], // web app manifest
    formAction: ["'self'"], // Form submissions
    frameAncestors: ["'self'"], // Sources that may frame or iframe us
    objectSrc: ["'none'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // for compatibility. ignored by browsers that know about nonces
      // Uber CDN bases
      'https://d1a3f4spazzrp4.cloudfront.net',
      'https://d3i4yxtzktqr9n.cloudfront.net',
      'https://tb-static.uber.com',
      'https://tbs-static.uber.com',
      nonce,
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      // Uber CDN bases
      'https://d1a3f4spazzrp4.cloudfront.net',
      'https://d3i4yxtzktqr9n.cloudfront.net',
      'https://tb-static.uber.com',
      'https://tbs-static.uber.com',
    ],
  };
}
