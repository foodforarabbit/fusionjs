import {Plugin} from '@uber/graphene-plugin';

export default () => {
  return class extends Plugin {
    constructor() {
      super();
      throw new Error('asset proxying is unavailable on the browser');
    }
  };
};
