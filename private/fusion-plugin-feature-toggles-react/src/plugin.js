// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import {ProviderPlugin} from 'fusion-react';
import type {Context} from 'fusion-core';
import featureToggles from '@uber/fusion-plugin-feature-toggles';
import type {
  FeatureTogglesServiceType,
  IFeatureTogglesClient,
} from '@uber/fusion-plugin-feature-toggles';

type PropsType = {
  provides: FeatureTogglesServiceType,
  ctx: Context,
  children: Array<any>,
};
type ContextType = any;
class FeatureTogglesProvider extends React.Component<PropsType> {
  featureToggles: IFeatureTogglesClient;

  constructor(props: PropsType, context: ContextType) {
    super(props, context);
    this.featureToggles = props.provides.from(props.ctx);
  }

  getChildContext() {
    return {featureToggles: this.featureToggles};
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

FeatureTogglesProvider.childContextTypes = {
  featureToggles: PropTypes.object.isRequired,
};

export default ProviderPlugin.create<*, *>(
  'featureToggles',
  featureToggles,
  FeatureTogglesProvider
);
