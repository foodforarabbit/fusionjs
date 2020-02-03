/* eslint-disable no-inner-declarations */
// @flow

import SentryLogger from 'sentry-logger';
import type {Logger} from 'winston';
import type {SentryConfigType} from '../types';

// let winstonLogger: Logger<{[string]: number}>;

// default function to please flow for imaginary browser case
// eslint-disable-next-line import/no-mutable-exports
let createLogger = (sentry: SentryConfigType, team?: string) => null;

if (__NODE__) {
  const winston = require('winston');
  const format = winston.format;

  function onRavenError(e) {
    // do something
  }

  function computeErrLoc(msg) {
    // this will be propened to ': <message>' in healthline event title
    return 'Error';
  }

  createLogger = function createLogger(
    {id: sentryDSN}: SentryConfigType,
    team?: string
  ): Logger<{[string]: number}> {
    const RavenClient = require('uber-raven').Client;
    const ravenClient = new RavenClient(sentryDSN);
    const Prober = require('airlock');

    const sentryLoggerOptions = {
      level: 'error',
      enabled: true,
      ravenClient: ravenClient,
      tags: {},
      computeErrLoc: computeErrLoc,
      onRavenError: onRavenError,
      sentryProber: new Prober({
        title: 'sentry',
        enabled: true,
        statsd: null,
        backend: ravenClient,
        detectFailuresBy: Prober.detectBy.EVENT,
        failureEvent: 'error',
        successEvent: 'logged',
      }),
      sentryProberDetectFailuresBy: SentryLogger.detectBy.EVENT,
      sentryProberDetectFailuresByEventFailureEvent: 'error',
      sentryProberDetectFailuresByEventSuccessEvent: 'logged',
    };

    return winston.createLogger({
      level: 'info',
      format: format.printf(info => JSON.stringify(info)),
      transports: [
        SentryLogger({
          sentryProber: {
            backend: ravenClient,
          },
          ravenClient,
          ...sentryLoggerOptions,
        }),
      ],
    });
  };
}

export default createLogger;
