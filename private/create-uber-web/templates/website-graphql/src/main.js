// @flow
/**
 ╔══════════════════════════════════════════════════════╗
 ║                                                      ║
 ║ WARNING: YOU PROBABLY SHOULD NOT MODIFY THIS FILE    ║
 ║                                                      ║
 ║ Plugins should be added in "src/plugins/main.js".    ║
 ║                                                      ║
 ║ If you absolutely must make a change to this file,   ║
 ║ please consider reaching out in the "Web Platform"   ║
 ║ uChat room with your use case so improvements can be ║
 ║ standardized across the company. Thank you!          ║
 ║                                                      ║
 ╚══════════════════════════════════════════════════════╝
*/
import App from 'fusion-apollo';
import type {Render} from 'fusion-core';
import type {Element} from 'react';
import DefaultRoot from './components/root.js';
import initUserPlugins from './plugins/main.js';
import initLogging from './uber/logging.js';
import initSecurity from './uber/security.js';
import initAssets from './uber/assets.js';
import initDataFetching from './uber/data-fetching.js';
import initI18n from './uber/i18n.js';
import initUI from './uber/ui.js';
import initGraphQL from './uber/graphql.js';
import initIntrospect from './uber/introspect.js';

export default async function start(root?: Element<*>, render?: Render) {
  const app = new App(root || DefaultRoot, render);
  // initialize default uber plugins
  initLogging(app);
  initSecurity(app);
  initAssets(app);
  initUI(app);
  initI18n(app);
  initDataFetching(app);
  initGraphQL(app);
  initUserPlugins(app);
  // NOTE: This must be registered last
  initIntrospect(app);
  return app;
}
