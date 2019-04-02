// @flow
/* eslint-env node */

import type {Context} from 'fusion-core';

import MorpheusClient from '../clients/morpheus.js';

test('ensure .load works as expected', async () => {
  const mockContext: Context = ({
    headers: {
      'user-agent': 'some-user-agent',
      'accept-language': 'en-US',
      'user-uuid': '0000',
    },
    url: 'some-url',
    query: '',
    ip: '192.168.0.0',
  }: any);
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

  const client = new MorpheusClient(mockContext, [], {atreyu: mockAtreyu});

  // We should not have attempted to load any experimentation details prior
  // to .load call
  const getTreatmentGroupsByName =
    mockAtreyu.createAsyncGraph.mock.results[0].value;
  expect(getTreatmentGroupsByName).toHaveBeenCalledTimes(0);
  expect(client.experiments).toBeUndefined();

  // Ensure .get fails if client has not yet been loaded
  await expect(client.get('some-toggle')).rejects.toThrow();

  // Load data
  await client.load();

  // Loading should be complete
  expect(getTreatmentGroupsByName).toHaveBeenCalledTimes(1);
  expect(client.experiments).toHaveProperty('someExperiment');
  expect(client.experiments.someExperiment).toHaveProperty('id');
  expect(client.experiments.someExperiment.id).toBe(12345);
});

test('simple service sanity check - toggle on/off with mocked dependencies', async () => {
  const mockContext: Context = ({
    headers: {
      'user-agent': 'some-user-agent',
      'accept-language': 'en-US',
      'user-uuid': '0000',
    },
    url: 'some-url',
    query: '',
    ip: '192.168.0.0',
  }: any);
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

  const client = new MorpheusClient(
    mockContext,
    ['someExperiment', 'noDataExperiment'],
    {atreyu: mockAtreyu}
  );
  await client.load();

  // Existing experiment
  let details = await client.get('someExperiment');
  expect(details).not.toBeNull();
  expect(details.enabled).toBe(true);
  expect(details).toHaveProperty('metadata');
  expect(details.metadata).toHaveProperty('id');
  if (details.metadata && details.metadata.id) {
    expect(details.metadata.id).toBe(12345);
  }

  // Existing experiment with no data
  details = await client.get('noDataExperiment');
  expect(details).not.toBeNull();
  expect(details.enabled).toBe(false);
  expect(details).not.toHaveProperty('metadata');

  // Nonexistent experiment
  await expect(client.get('someMissingExperiment')).rejects.toThrow();
});

test('test atreyu "getTreatmentGroupsByNames" failure', async () => {
  const mockContext: Context = ({
    headers: {
      'user-agent': 'some-user-agent',
      'accept-language': 'en-US',
      'user-uuid': '0000',
    },
    url: 'some-url',
    query: '',
    ip: '192.168.0.0',
  }: any);
  const mockAtreyu = {
    createAsyncGraph: jest.fn(() =>
      jest.fn(() => {
        throw new Error('Unable to create async graph!');
      })
    ),
  };

  const client = new MorpheusClient(mockContext, [], {atreyu: mockAtreyu});
  await expect(client.load()).rejects.toThrow();
});
