// @flow
import get from 'just-safe-get';
import type {Context} from 'fusion-core';

export default function getInitialState(ctx: Context) {
  return get(ctx, 'res.locals.state') || {};
}
