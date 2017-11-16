// @flow
import tape from 'tape-cup';
import routeTiming from '../../handlers/route-timing';
import M3 from '../../emitters/m3';
import EventEmitter from 'events';

tape('route timing - pageview:server', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  routeTiming({events, m3});

  events.on('m3:increment', ({key, tags}) => {
    t.equal(key, 'pageview:server', 'logs the correct key');
    t.deepLooseEqual(tags, {route: 'test'}, 'logs the correct tags');
    t.end();
  });
  events.emit('pageview:server', {title: 'test'});
});

tape('route timing - pageview:browser', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  routeTiming({events, m3});

  events.on('m3:increment', ({key, tags}) => {
    t.equal(key, 'pageview:browser', 'logs the correct key');
    t.deepLooseEqual(tags, {route: 'test'}, 'logs the correct tags');
    t.end();
  });
  events.emit('pageview:browser', {title: 'test'});
});

tape('route timing - route_time', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  routeTiming({events, m3});

  events.on('m3:timing', ({key, value, tags}) => {
    t.equal(key, 'route_time', 'logs the correct key');
    t.equal(value, 5, 'logs the correct value');
    t.deepLooseEqual(
      tags,
      {route: 'test-route', status: 'test-status'},
      'logs the correct tags'
    );
    t.end();
  });
  events.emit('pageview:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
});

tape('route timing - downstream:server', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  routeTiming({events, m3});

  events.on('m3:timing', ({key, value, tags}) => {
    t.equal(key, 'downstream:server', 'logs the correct key');
    t.equal(value, 5, 'logs the correct value');
    t.deepLooseEqual(
      tags,
      {route: 'test-route', status: 'test-status'},
      'logs the correct tags'
    );
    t.end();
  });
  events.emit('downstream:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
});

tape('route timing - render:server', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  routeTiming({events, m3});

  events.on('m3:timing', ({key, value, tags}) => {
    t.equal(key, 'render:server', 'logs the correct key');
    t.equal(value, 5, 'logs the correct value');
    t.deepLooseEqual(
      tags,
      {route: 'test-route', status: 'test-status'},
      'logs the correct tags'
    );
    t.end();
  });
  events.emit('render:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
});

tape('route timing - upstream:server', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  routeTiming({events, m3});

  events.on('m3:timing', ({key, value, tags}) => {
    t.equal(key, 'upstream:server', 'logs the correct key');
    t.equal(value, 5, 'logs the correct value');
    t.deepLooseEqual(
      tags,
      {route: 'test-route', status: 'test-status'},
      'logs the correct tags'
    );
    t.end();
  });
  events.emit('upstream:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
});
