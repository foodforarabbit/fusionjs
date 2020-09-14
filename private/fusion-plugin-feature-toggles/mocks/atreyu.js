// @flow

/**
 * Generates a mock for '@uber/fusion-plugin-atreyu'.
 *
 * An object containing top level overrides for any of the properties/methods
 * may be provided.  For example:
 *
 * const mock = mockFactory({
 *   createAsyncGraph: () => ({
 *     treatments: { someExperiment: { id: 12345, name: 'test' }}
 *   })
 * });
 */
const mockFactory = (overrides?: {[string]: mixed} = {}): any => {
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

  return {
    ...mockAtreyu,
    ...overrides,
  };
};

export default mockFactory;
