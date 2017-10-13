import util from 'util';
import Atreyu from '@uber/atreyu';
import {Plugin} from '@uber/graphene-plugin';

export default ({config, options, graphs, requests} = {}) => {
  const atreyu = new Atreyu(config, options);

  const graphMap = {};
  for (const key in graphs) {
    graphMap[key] = atreyu.createGraph(graphs[key]);
  }

  const requestMap = {};
  for (const key in requests) {
    requestMap[key] = atreyu.createRequest(requests[key]);
  }

  return class Atreyu extends Plugin {
    constructor(ctx) {
      super(ctx);
      this.graphs = {};
      for (const key in graphMap) {
        this.graphs[key] = {
          resolve: util.promisify((...args) => graphMap[key].resolve(...args)),
        };
      }

      this.requests = {};
      for (const key in requestMap) {
        this.requests[key] = {
          resolve: util.promisify((...args) =>
            requestMap[key].resolve(...args)
          ),
        };
      }
    }
    static cleanup() {
      atreyu.cleanup();
    }
  };
};
