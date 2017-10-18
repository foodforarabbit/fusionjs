import {Plugin} from '@uber/graphene-plugin';

export default () => {
  return class extends Plugin {
    constructor() {
      super();
      throw new Error('secrets are unavailable on the browser');
    }
  };
};
