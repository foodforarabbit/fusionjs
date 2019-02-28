import React, {Component} from 'react';
import {Link} from 'react-router';
import ReactRoutingTopBar from '@uber/react-routing-top-bar';

const root = '/';
const _ROUTES = [
  {
    path: '/',
    text: 'App',
    indexOnly: true,
  },
];

// This is a basic navigation component for your application. If you want to add
// additional routes, you can do so by updated the _ROUTES variable.
// Adding a new page tutorial: https://code.uberinternal.com/w/web/docs/tutorials/adding-a-new-page/
class Nav extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };

  static propTypes = {
    routePrefix: React.PropTypes.string,
  };

  isPathActive(urlPath, indexOnly) {
    // indexOnly ensures that nested child routes won't make their parent active
    // https://github.com/reactjs/react-router/blob/master/docs/API.md#isactivepathorloc-indexonly
    return this.context.router.isActive({pathname: urlPath}, indexOnly);
  }

  render() {
    const reactRoutingTopBarProps = {
      Link,
      titleLink: root,
      routePrefix: this.props.routePrefix,
      topBarProps: {
        isDark: true,
        hasLogo: true,
        title: 'template',
      },
      isPathActive: (urlPath, indexOnly) =>
        this.isPathActive(urlPath, indexOnly),
      routes: _ROUTES,
    };
    return <ReactRoutingTopBar {...reactRoutingTopBarProps} />;
  }
}

export default Nav;
