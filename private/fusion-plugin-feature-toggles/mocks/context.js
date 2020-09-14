// @flow

import type {Context} from 'fusion-core';

/**
 * Generates a mock the 'Context' object, whose type is provided by
 * 'fusion-core'.
 *
 * An object containing top level overrides for any of the properties/methods
 * may be provided.  For example:
 *
 * const mock = mockFactory({
 *   url: 'some-other-url'
 * });
 */
const mockFactory = (ctx?: {[string]: any} = {}): Context => {
  const defaultContext = {
    headers: {
      'user-agent': 'some-user-agent',
      'accept-language': 'en-US',
    },
    cookies: {
      get: name => (name === 'marketing_vistor_id' ? '1234' : null),
    },
    url: 'some-url',
    query: '',
    ip: '192.168.0.0',
  };

  return {
    ...defaultContext,
    ...ctx,
  };
};

export default mockFactory;
