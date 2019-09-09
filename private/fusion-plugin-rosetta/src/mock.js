// @flow
import type {RosettaServiceType} from './types.js';

const mockRosetta: RosettaServiceType = {
  from: () => ({
    translations: {},
    locale: 'en',
  }),
};

export default mockRosetta;
