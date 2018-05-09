import get from 'just-safe-get';

export default function getInitialState(ctx) {
  return get(ctx, 'res.locals.state') || {};
}
