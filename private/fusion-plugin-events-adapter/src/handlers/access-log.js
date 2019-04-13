// @flow
import type {Logger} from 'fusion-tokens';
import type {UniversalEventsType} from 'fusion-plugin-universal-events';

export default function accessLogHandler({
  events,
  logger,
}: {
  events: UniversalEventsType,
  logger: Logger,
}) {
  events.on('access-log', payload => {
    logger.info('access log', payload);
  });
}
