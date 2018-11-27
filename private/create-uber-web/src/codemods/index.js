import csrfEnhancerCodemod from './fusion-plugin-csrf-protection/enhancer.js';
import replacePackage from './replace-package/codemod-replace-package.js';
import addPackage from './add-package/codemod-add-package';

export default [
  csrfEnhancerCodemod,
  replacePackage('fusion-react-async', 'fusion-react'),
  replacePackage(
    'fusion-plugin-universal-events',
    'fusion-plugin-universal-events-react',
  ),
  replacePackage('@uber/fusion-plugin-m3', '@uber/fusion-plugin-m3-react'),
  replacePackage('fusion-plugin-i18n', 'fusion-plugin-i18n-react'),
  replacePackage(
    '@uber/fusion-plugin-logtron',
    '@uber/fusion-plugin-logtron-react',
  ),
  addPackage('styletron-react'),
];
