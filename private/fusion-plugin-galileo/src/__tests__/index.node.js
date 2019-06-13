// @flow
/* eslint-env node */
import test from 'tape-cup';

import App, {createToken} from 'fusion-core';
import type {Context} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';

import {M3Token} from '@uber/fusion-plugin-m3';
// eslint-disable-next-line no-unused-vars
import type {M3TagsType as TagsType} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';

import GalileoPlugin from '../server.js';
import {
  GalileoConfigToken as ConfigToken,
  GalileoClientToken as ClientToken,
} from '../tokens.js';
import type {GalileoServiceType} from '../types';

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
  increment: (string: string, TagsType: ?TagsType): void => {},
  decrement: (string: string, TagsType: ?TagsType): void => {},
  timing: (string: string, number: ?number, TagsType: ?TagsType): void => {},
  gauge: (string: string, number: ?number, TagsType: ?TagsType): void => {},
  scope: (string: string): void => {},
  immediateCounter: (
    string: string,
    number: ?number,
    TagsType: ?TagsType
  ): void => {},
  immediateIncrement: (string: string, TagsType: ?TagsType): void => {},
  immediateDecrement: (string: string, TagsType: ?TagsType): void => {},
  immediateTiming: (
    string: string,
    number: ?number,
    TagsType: ?TagsType
  ): void => {},
  immediateGauge: (
    string: string,
    number: ?number,
    TagsType: ?TagsType
  ): void => {},
  close: async (string: string): Promise<void> => {},
};
const mockTracer = {tracer: 'tracer'};

test('Galileo Plugin', (t): void => {
  t.ok(GalileoPlugin, 'exported correctly');
  t.end();
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

test('fusion Galileo Plugin', (t): void => {
  const config = {test: 'test'};

  function MockGalileo(cfg, tracer, format, logger, m3): {||} {
    t.looseEquals(
      cfg,
      {
        appName: process.env.UBER_OWNER,
        galileo: {
          enabled: true,
          test: 'test',
          allowedEntities: ['EVERYONE'],
          enforcePercentage: 0.0,
          wonkamasterUrl: 'https://wonkabar.uberinternal.com',
        },
      },
      'config is passed down'
    );
    t.equal(tracer, 'tracer', 'tracer instance needs to be passed down');
    t.equal(m3, mockM3, 'm3 needs to be passed down');
    t.equal(logger, 'logger', 'logger instance needs to be passed down');
    t.equal(format, 'http_headers', 'format needs to be passed down');
    return Object.freeze({});
  }

  assertPlugin(config, MockGalileo, Galileo => {
    t.ok(Galileo.galileo, 'should have galileo instance created');
    t.ok(Galileo.destroy(), 'should destory the galileo instance');
  });
  t.end();
});

test('fusion Galileo Plugin custom appName', t => {
  const config = {appName: 'my-app-name', test: 'test'};

  function MockGalileo(cfg, tracer, format, logger, m3): {||} {
    t.looseEquals(
      cfg,
      {
        appName: 'my-app-name',
        galileo: {
          enabled: true,
          test: 'test',
          allowedEntities: ['EVERYONE'],
          enforcePercentage: 0.0,
          wonkamasterUrl: 'https://wonkabar.uberinternal.com',
        },
      },
      'config is passed down'
    );
    return Object.freeze({});
  }

  assertPlugin(config, MockGalileo, Galileo => {
    t.ok(Galileo.galileo, 'should have galileo instance created');
    t.ok(Galileo.destroy(), 'should destory the galileo instance');
  });
  t.end();
});

test('fusion Galileo Plugin disabled', (t): void => {
  const config = {enabled: false};

  function MockGalileo(): void {
    t.fail('should not instantiate galileo client');
  }

  assertPlugin(config, MockGalileo, Galileo => {
    t.equal(Galileo.galileo, null, 'should have null galileo client');
    t.doesNotThrow(
      (): boolean | void => Galileo.destroy(),
      'should have destroy function'
    );
  });
  t.end();
});
