// @flow
import {serializePayload} from '../dom-events-tracker';

test('serializePayload', async () => {
  expect(() => {
    serializePayload({test: 'value'});
  }).not.toThrow();
  expect(() => {
    serializePayload('value');
  }).toThrow();
});
