// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import type {IFeatureTogglesClient} from '@uber/fusion-plugin-feature-toggles';

export type TogglePropsType = {
  toggleName: string,
  children: React.Node,
};

type ToggleContextType = {
  featureToggles?: IFeatureTogglesClient,
};

type ToggleStateType = {
  isEnabled: boolean,
};

class Toggle extends React.Component<TogglePropsType, ToggleStateType> {
  context: ToggleContextType;
  props: TogglePropsType;

  constructor(props: TogglePropsType, context: ToggleContextType) {
    super(props, context);

    this.props = props;
    this.context = context;

    this.state = {isEnabled: false};
  }

  async componentDidMount() {
    const isEnabled =
      (this.context.featureToggles &&
        (await this.context.featureToggles.get(this.props.toggleName))
          .enabled) ||
      false;
    this.setState({isEnabled});
  }

  render() {
    return this.state.isEnabled ? wrapContent(this.props.children) : null;
  }
}

Toggle.contextTypes = {
  featureToggles: PropTypes.object,
};

export default Toggle;

/* Helper functions */
function wrapContent(content: React.Node): React.Node {
  return React.Fragment ? <>{content}</> : <span>{content}</span>;
}
