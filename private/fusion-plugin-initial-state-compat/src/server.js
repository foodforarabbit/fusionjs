// @flow
import get from 'just-safe-get';
import type {Context} from 'fusion-core';

export default function getInitialState(ctx: Context): {||} | any {
  return get(ctx, 'res.locals.state') || {};
}
