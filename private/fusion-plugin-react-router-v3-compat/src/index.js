import Plugin from './plugin';

/* components */
export {Router, Link, IndexLink, withRouter} from 'react-router';

/* components (configuration) */
export {IndexRedirect, IndexRoute, Redirect, Route} from 'react-router';

/* utils */
export {
  createRoutes,
  RouterContext,
  locationShape,
  routerShape,
  match,
  formatPattern,
  applyRouterMiddleware,
} from 'react-router';

/* histories */
export {browserHistory, hashHistory, createMemoryHistory} from 'react-router';

export default Plugin;
