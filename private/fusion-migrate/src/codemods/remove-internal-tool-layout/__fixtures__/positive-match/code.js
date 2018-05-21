import React, {Component} from 'react';
import InternalToolLayout from '@uber/internal-tool-layout';
import {SuperfineRoot} from '@uber/superfine-react';

export default class App extends Component {
  render() {
    return (
      <SuperfineRoot>
        <InternalToolLayout {...bedrock} dispatch={dispatch} mock={mock}>
          <Head />
          <Nav routePrefix={bedrock.routePrefix} />
        </InternalToolLayout>
      </SuperfineRoot>
    );
  }
}
