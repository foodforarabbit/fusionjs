import assert from 'assert';
import routeTiming from './handlers/route-timing';
import {Plugin} from '@uber/graphene-plugin';

export default function EventsAdapterFactory({UniversalEvents}) {
  assert.ok(UniversalEvents, '{UniversalEvents} dependency is required');
  const events = UniversalEvents.of();
  assert.ok(
    events,
    '{UniversalEvents.of()} must return an instance of UniversalEvents'
  );
  routeTiming(events);
  return class NoopPlugin extends Plugin {};
}
