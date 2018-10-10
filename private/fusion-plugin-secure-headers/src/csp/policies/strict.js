// @flow
/* eslint-env node */
export default function Strict(nonce) {
  return {
    blockAllMixedContent: true, // Block loading of insecure resources
    objectSrc: ["'none'"],
    scriptSrc: [
      nonce, // Nonce
      "'unsafe-inline'", // For backwards compatibility
      "'unsafe-eval'", // Allow eval
      "'strict-dynamic'", // Allow scripts that inherit nonce from their parent script
      'https:', // For backwards compatibility
      'http:', // For backwards compatibility
    ],
  };
}
