import {combineReducers} from 'redux';

import routingReducer from '@uber/redux-store/routing-reducer';
import {magellanReducer} from '@uber/internal-tool-layout';

function noOpReducer(state, action) {
  return state || {};
}

export default combineReducers({
  magellan: magellanReducer,
  bedrock: noOpReducer,
  dashState: noOpReducer,
  routing: routingReducer,
});
