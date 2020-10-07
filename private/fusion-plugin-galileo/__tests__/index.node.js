// @flow
/* eslint-env node */
import App, {createToken} from 'fusion-core';
import type {Context} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';

import {M3Token} from '@uber/fusion-plugin-m3';
// eslint-disable-next-line no-unused-vars
import type {M3TagsType as TagsType} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';

import GalileoPlugin from '../src/server.js';
import {
  GalileoConfigToken as ConfigToken,
  GalileoClientToken as ClientToken,
} from '../src/tokens.js';
import type {GalileoServiceType} from '../src/types';

const mockLogger = {
  createChild: (): string => 'logger',
  log: (msg: any): any => {},
  error: (msg: any): any => {},
  warn: (msg: any): any => {},
  info: (msg: any): any => {},
  verbose: (msg: any): any => {},
  debug: (msg: any): any => {},
  silly: (msg: any): any => {},
};
const mockM3 = {
  counter: (string: string, number: ?number, TagsType: ?TagsType): void => {},
  histogram: (string: string, number: ?number, TagsType: ?TagsType): void => {},
  increment: (string: string, TagsType: ?TagsType): void => {},
  decrement: (string: string, TagsType: ?TagsType): void => {},
  timing: (
    string: string,
    number: ?number | ?Date,
    TagsType: ?TagsType
  ): void => {},
  gauge: (string: string, number: ?number, TagsType: ?TagsType): void => {},
  scope: (TagsType: ?TagsType) => mockM3,
  immediateCounter: (
    string: string,
    number: ?number,
    TagsType: ?TagsType
  ): void => {},
  immediateHistogram: (
    string: string,
    number: ?number,
    TagsType: ?TagsType
  ): void => {},
  immediateIncrement: (string: string, TagsType: ?TagsType): void => {},
  immediateDecrement: (string: string, TagsType: ?TagsType): void => {},
  immediateTiming: (
    string: string,
    number: ?number | ?Date,
    TagsType: ?TagsType
  ): void => {},
  immediateGauge: (
    string: string,
    number: ?number,
    TagsType: ?TagsType
  ): void => {},
  close: async (string: string): Promise<void> => {},
};
const mockTracer: any = {tracer: 'tracer'};

test('Galileo Plugin', () => {
  expect(GalileoPlugin).toBeTruthy();
});

function assertPlugin(
  config: {},
  MockGalileo: any,
  assert: GalileoServiceType => void
) {
  const gToken = createToken('Galileo');
  const app = new App('el', el => el);
  app.register(LoggerToken, mockLogger);
  app.register(M3Token, mockM3);
  app.register(TracerToken, mockTracer);
  app.register(ClientToken, MockGalileo);
  app.register(ConfigToken, config);
  app.register(gToken, GalileoPlugin);
  app.middleware({Galileo: gToken}, ({Galileo}): ((
    ctx: Context,
    next: () => Promise<void>
  ) => Promise<void>) => {
    assert(Galileo);
    return (ctx: Context, next: () => Promise<void>): Promise<void> => next();
  });
  getSimulator(app);
}

test('fusion Galileo Plugin', () => {
  const config = {test: 'test'};

  function MockGalileo(cfg, tracer, format, logger, m3): {||} {
    expect(cfg).toStrictEqual({
      appName: process.env.UBER_OWNER,
      galileo: {
        enabled: true,
        test: 'test',
        allowedEntities: ['EVERYONE'],
        enforcePercentage: 0.0,
        wonkamasterUrl: 'https://wonkabar.uberinternal.com',
      },
    }); // 'config is passed down'

    expect(tracer).toBe('tracer');
    expect(m3).toBe(mockM3);
    expect(logger).toBe('logger');
    expect(format).toBe('http_headers');
    return Object.freeze({});
  }

  assertPlugin(config, MockGalileo, Galileo => {
    expect(Galileo.galileo).toBeTruthy();
    expect(Galileo.destroy()).toBeTruthy();
  });
});

test('fusion Galileo Plugin custom appName', () => {
  const config = {appName: 'my-app-name', test: 'test'};

  function MockGalileo(cfg, tracer, format, logger, m3): {||} {
    expect(cfg).toStrictEqual({
      appName: 'my-app-name',
      galileo: {
        enabled: true,
        test: 'test',
        allowedEntities: ['EVERYONE'],
        enforcePercentage: 0.0,
        wonkamasterUrl: 'https://wonkabar.uberinternal.com',
      },
    }); // 'config is passed down'

    return Object.freeze({});
  }

  assertPlugin(config, MockGalileo, Galileo => {
    expect(Galileo.galileo).toBeTruthy();
    expect(Galileo.destroy()).toBeTruthy();
  });
});

test('fusion Galileo Plugin disabled', done => {
  const config = {enabled: false};

  function MockGalileo(): void {
    // $FlowFixMe
    done.fail('should not instantiate galileo client');
  }

  assertPlugin(config, MockGalileo, Galileo => {
    expect(Galileo.galileo).toBe(null);
    expect((): boolean | void => Galileo.destroy()).not.toThrow();
  });
  done();
});
