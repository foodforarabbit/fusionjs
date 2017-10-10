/* eslint-env node */
export default function UberDefault(nonce) {
  return {
    defaultSrc: ["'none'"], // Default if a directive is not specified
    blockAllMixedContent: true, // Block loading of insecure resources
    childSrc: ["'self'"], // Iframes, web workers, etc.
    connectSrc: ["'self'"], // XHR, WebSockets, etc.
    fontSrc: ["'self'", 'data:'],
    formAction: ["'self'"], // Form submissions
    frameAncestors: ["'self'"], // Sources that may frame or iframe us
    frameSrc: ["'self'"], // Older version of child-src, still needed for compatibility
    imgSrc: ["'self'", 'data:'],
    mediaSrc: ["'self'"], // Audio and video
    objectSrc: ["'none'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // for compatibility. ignored by browsers that know about nonces
      nonce,
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
  };
}
