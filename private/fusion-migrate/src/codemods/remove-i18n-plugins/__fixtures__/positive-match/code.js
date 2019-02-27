import I18n, {I18nToken, I18nLoaderToken} from 'fusion-plugin-i18n-react';
import Rosetta from '@uber/fusion-plugin-rosetta';
import App from 'fusion-react';

export default (async function main() {
  const app = new App();
  if (__NODE__) {
    app.register(test, test);
    app.register(I18nLoaderToken, Rosetta);
    app.register(test, test);
    app.register(I18nToken, I18n);
    app.register(test, test);
  } else {
    app.register(test, test);
    app.register(I18nToken, I18n);
    app.register(test, test);
  }
});
