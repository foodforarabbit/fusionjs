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
  replacePackage('fusion-plugin-m3', 'fusion-plugin-m3-react'),
  replacePackage('fusion-plugin-i18n', 'fusion-plugin-i18n-react'),
  replacePackage('fusion-plugin-logtron', 'fusion-plugin-logtron-react'),
  replacePackage('fusion-plugin-logtron', 'fusion-plugin-logtron-react'),
  addPackage('styletron-react'),
];
