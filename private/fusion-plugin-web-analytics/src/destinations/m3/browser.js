// @flow
import type {IEmitter} from '../../types';

export function M3Emitter({events}: {events: IEmitter}) {
  const _m3 = method => (data: any) => events.emit(`m3:${method}`, data);
  Object.assign(this, {
    counter: _m3('counter'),
    increment: _m3('increment'),
    decrement: _m3('decrement'),
    timing: _m3('timing'),
    gauge: _m3('gauge'),
  });
}
