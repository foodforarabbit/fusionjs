const compose = require('../utils/compose');

module.exports = compose(
  ({source}) =>
    source.replace(
      `import {test, render} from 'fusion-test-utils';`,
      `import {test, getSimulator} from 'fusion-test-utils';`
    ),
  ({source}) =>
    source.replace(
      `const ctx = await render(app, '/');`,
      `const ctx = await getSimulator(app).render('/');`
    )
);
