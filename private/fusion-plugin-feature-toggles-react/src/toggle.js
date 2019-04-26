// @flow

import * as React from 'react';

import {useService, FusionContext} from 'fusion-react';

import {FeatureTogglesToken} from './index.js';

export type TogglePropsType = {
  toggleName: string,
  children: React.Node,
};

export default (props: TogglePropsType): React.Node => {
  const featureToggles = useService(FeatureTogglesToken);
  const context = React.useContext(FusionContext);

  const toggle = featureToggles.from(context).get(props.toggleName);

  return toggle.enabled ? wrapContent(props.children) : null;
};

/* Helper functions */
function wrapContent(content: React.Node): React.Node {
  return React.Fragment ? <>{content}</> : <span>{content}</span>;
}
