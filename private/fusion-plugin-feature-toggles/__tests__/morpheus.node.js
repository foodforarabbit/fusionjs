// @flow
/* eslint-env node */

import type {Context} from 'fusion-core';

import MorpheusClient, {type MorpheusContextType} from '../src/clients/morpheus.js';

test('ensure .load works as expected', async () => {
  const mockContext = createMockContext({
    headers: {'user-uuid': '0000'},
    cookies: undefined,
  });

  const mockAtreyu = {
    createAsyncGraph: jest.fn(() =>
      jest.fn(() => ({
        treatments: {
          someExperiment: {
            id: 12345,
          },
        },
      }))
    ),
  };

  const client = new MorpheusClient(
    mockContext,
    [],
    {atreyu: mockAtreyu},
    {metadataTransform: metadata => metadata}
  );

  // We should not have attempted to load any experimentation details prior
  // to .load call
  const getTreatmentGroupsByName =
    mockAtreyu.createAsyncGraph.mock.results[0].value;
  expect(getTreatmentGroupsByName).toHaveBeenCalledTimes(0);
  expect(client.experiments).toBeUndefined();

  // Ensure .get fails if client has not yet been loaded
  expect(() => client.get('some-toggle')).toThrow();

  // Load data
  await client.load();

  // Loading should be complete
  expect(getTreatmentGroupsByName).toHaveBeenCalledTimes(1);
  expect(client.experiments).toHaveProperty('someExperiment');
  expect(client.experiments.someExperiment).toHaveProperty('id');
  expect(client.experiments.someExperiment.id).toBe(12345);
});

test('simple service sanity check - toggle on/off with mocked dependencies', async () => {
  const mockContext = createMockContext({
    headers: {'user-uuid': '0000'},
    cookies: undefined,
  });
  const mockAtreyu = {
    createAsyncGraph: jest.fn(() =>
      jest.fn(() => ({
        treatments: {
          someExperiment: {
            id: 12345,
            name: 'treatment',
          },
          controlExperiment: {
            id: 12346,
            name: 'control',
          },
        },
      }))
    ),
  };

  const client = new MorpheusClient(
    mockContext,
    ['someExperiment', 'controlExperiment', 'noDataExperiment'],
    {atreyu: mockAtreyu},
    {metadataTransform: metadata => metadata}
  );
  await client.load();

  // Existing experiment in treatment group
  let details = await client.get('someExperiment');
  expect(details).not.toBeNull();
  expect(details.enabled).toBe(true);
  expect(details).toHaveProperty('metadata');
  expect(details.metadata).toHaveProperty('id');
  if (details.metadata && details.metadata.id) {
    expect(details.metadata.id).toBe(12345);
  }
  expect(details.metadata).toHaveProperty('name');
  if (details.metadata && details.metadata.name) {
    expect(details.metadata.name).toBe('treatment');
  }

  // Existing experiment in control group
  details = await client.get('controlExperiment');
  expect(details).not.toBeNull();
  expect(details.enabled).toBe(false);
  expect(details).toHaveProperty('metadata');
  if (details.metadata && details.metadata.id) {
    expect(details.metadata.id).toBe(12346);
  }
  expect(details.metadata).toHaveProperty('name');
  if (details.metadata && details.metadata.name) {
    expect(details.metadata.name).toBe('control');
  }

  // Existing experiment with no data
  details = await client.get('noDataExperiment');
  expect(details).not.toBeNull();
  expect(details.enabled).toBe(false);
  expect(details).not.toHaveProperty('metadata');

  // Nonexistent experiment
  expect(() => client.get('someMissingExperiment')).toThrow();
});

test('test atreyu "getTreatmentGroupsByNames" failure', async () => {
  const mockContext = createMockContext();
  const mockAtreyu = {
    createAsyncGraph: jest.fn(() =>
      jest.fn(() => {
        throw new Error('Unable to create async graph!');
      })
    ),
  };

  const client = new MorpheusClient(mockContext, [], {atreyu: mockAtreyu}, {});
  await expect(client.load()).rejects.toThrow();
});

test('simple enhance Morpheus context', async () => {
  const mockContext = createMockContext();
  const mockAtreyu = {
    createAsyncGraph: jest.fn(() =>
      jest.fn(() => ({
        treatments: {
          someExperiment: {
            id: 12345,
            name: 'treatment',
          },
        },
      }))
    ),
  };

  const enhancer = (ctx: Context, defaults: MorpheusContextType) => {
    // ensure defaults exist
    expect(defaults).toHaveProperty('ipAddress');
    expect(defaults.ipAddress).toBe('192.168.0.0');

    return {
      url: 'hello-url',
      newProp: 5,
    };
  };
  const client = new MorpheusClient(
    mockContext,
    ['someExperiment'],
    {atreyu: mockAtreyu},
    {enhanceContext: enhancer}
  );

  await expect(client.load()).resolves.not.toThrow(); // should call getTreatmentGroupsByName

  // Verify that the arguments passed to getTreatmentGroupsByName match the enhanced
  // context.
  const getTreatmentGroupsByName =
    mockAtreyu.createAsyncGraph.mock.results[0].value;
  expect(getTreatmentGroupsByName).toHaveBeenCalledTimes(1);
  const call = getTreatmentGroupsByName.mock.calls[0][0];
  expect(call).toHaveProperty('context');
  expect(call.context).toHaveProperty('url');
  expect(call.context.url).toBe('hello-url');
  expect(call.context).toHaveProperty('newProp');
  expect(call.context.newProp).toBe(5);
  expect(call.context).not.toHaveProperty('urlParameters');
});

test('simple transform metadata', async () => {
  const mockContext = createMockContext();
  const mockAtreyu = {
    createAsyncGraph: jest.fn(() =>
      jest.fn(() => ({
        treatments: {
          someExperiment: {
            id: 12345,
            name: 'treatment',
          },
        },
      }))
    ),
  };

  const transform = data => {
    expect(data).not.toBeNull();
    expect(data).toHaveProperty('id');
    expect(data.id).toBe(12345);
    expect(data).toHaveProperty('name');
    expect(data.name).toBe('treatment');

    return {
      id: data.id + 1,
      inchesOfRain: 'ten',
    };
  };

  const client = new MorpheusClient(
    mockContext,
    ['someExperiment'],
    {atreyu: mockAtreyu},
    {metadataTransform: transform}
  );

  await client.load();

  // Existing experiment in treatment group
  let details = await client.get('someExperiment');
  expect(details).not.toBeNull();
  expect(details.enabled).toBe(true);
  expect(details).toHaveProperty('metadata');

  // Transformed property
  expect(details.metadata).toHaveProperty('id');
  if (details.metadata && details.metadata.id) {
    expect(details.metadata.id).toBe(12345 + 1);
  }

  // Removed property
  expect(details.metadata).not.toHaveProperty('name');

  // New property
  expect(details.metadata).toHaveProperty('inchesOfRain');
  if (details.metadata && details.metadata.inchesOfRain) {
    expect(details.metadata.inchesOfRain).toBe('ten');
  }
});

test('default transform metadata', async () => {
  const mockContext = createMockContext();
  const mockAtreyu = {
    createAsyncGraph: jest.fn(() =>
      jest.fn(() => ({
        treatments: {
          someExperiment: {
            id: 12345,
            name: 'treatment',
            parameters: {
              color: 'green',
            },
          },
        },
      }))
    ),
  };

  const client = new MorpheusClient(
    mockContext,
    ['someExperiment'],
    {atreyu: mockAtreyu},
    {}
  );

  await client.load();

  // Existing experiment in treatment group
  let details = await client.get('someExperiment');
  expect(details).not.toBeNull();
  expect(details.enabled).toBe(true);
  expect(details).toHaveProperty('metadata');

  // Transformed property
  expect(details.metadata).not.toHaveProperty('id');
  expect(details.metadata).toHaveProperty('name');
  expect(details.metadata).toHaveProperty('parameters');
  if (details.metadata && details.metadata.parameters) {
    const params = details.metadata.parameters;
    expect(params).toHaveProperty('color');
    expect(params.color).toBe('green');
  }
});

test('timeout threshold exceeded', async () => {
  const mockContext = createMockContext();
  const createMockAtreyu = (ms: number) => ({
    createAsyncGraph: jest.fn(() =>
      jest.fn(async () => {
        await delay(ms);

        return {
          treatments: {
            someExperiment: {},
          },
        };
      })
    ),
  });

  /* Atreyu call resolves  before timeout */
  let client = new MorpheusClient(
    mockContext,
    ['someExperiment'],
    {atreyu: createMockAtreyu(150)},
    {timeoutThreshold: 200}
  );
  await client.load();
  expect(client.experiments).toHaveProperty('someExperiment');

  /* Atreyu call resolves  after timeout */
  client = new MorpheusClient(
    mockContext,
    ['someExperiment'],
    {atreyu: createMockAtreyu(250)},
    {timeoutThreshold: 200}
  );
  await client.load();
  expect(client.experiments).toEqual({});
});

test('multiple url params with the same key', async () => {
  const mockContext = createMockContext({
    headers: {'user-uuid': '0000'},
    cookies: undefined,
    query: {
      mykey: ['myfirstval', 'mysecondval'],
    },
  });
  const mockAtreyu = {
    createAsyncGraph: jest.fn(() =>
      jest.fn(() => ({
        treatments: {},
      }))
    ),
  };
  const client = new MorpheusClient(
    mockContext,
    ['someExperiment', 'controlExperiment', 'noDataExperiment'],
    {atreyu: mockAtreyu},
    {metadataTransform: metadata => metadata}
  );

  expect(client.getContext(mockContext).urlParameters).toEqual({
    mykey: '["myfirstval","mysecondval"]',
  });
});

/* HELPER FUNCTIONS */

/**
 * Helper that asynchronously delays for the provided time, ms, in milliseconds.
 */
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper that generates a basic mock Context object.
 */
function createMockContext(ctx?: {[string]: any} = {}): Context {
  const def = {
    headers: {
      'user-agent': 'some-user-agent',
      'accept-language': 'en-US',
    },
    cookies: {
      get: name => (name === 'marketing_vistor_id' ? '0000' : null),
    },
    url: 'some-url',
    query: '',
    ip: '192.168.0.0',
  };

  return {
    ...def,
    ...ctx,
  };
}
