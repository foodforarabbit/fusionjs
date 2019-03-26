// @flow
/* eslint-env browser */
import plugin from './plugin';
import withM3 from './hoc';

export {
  M3Token,
  M3ClientToken,
  CommonTagsToken,
  mock,
} from '@uber/fusion-plugin-m3';
export type {M3Type, M3TagsType, M3DepsType} from '@uber/fusion-plugin-m3';

export default plugin;
export {withM3};
