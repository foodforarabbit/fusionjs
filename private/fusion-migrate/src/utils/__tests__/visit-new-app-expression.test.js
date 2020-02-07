const babel = require('@babel/core');
const visitNewAppExpression = require('../visit-new-app-expression.js');

test('visitNewAppExpression', async () => {
  let visitCount = 0;
  const plugin = ({types}) => {
    return {
      visitor: visitNewAppExpression(types, (t, state, refPath, path) => {
        visitCount++;
        expect(t).toBeTruthy();
        expect(state).toBeTruthy();
        expect(refPath).toBeTruthy();
        expect(path).toBeTruthy();
      }),
    };
  };
  transform(
    `
    import App from 'fusion-react';

    console.log(App);
    App.test();

    const app = new App(<div />);
  `,
    plugin
  );
  expect(visitCount).toEqual(1);
});

test('visitNewAppExpression no match', async () => {
  let visitCount = 0;
  const plugin = ({types}) => {
    return {
      visitor: visitNewAppExpression(types, () => {
        visitCount++;
      }),
    };
  };
  expect(() =>
    transform(
      `
    import App from 'fusion-react';

    console.log(App);
    App.test();
  `,
      plugin
    )
  ).toThrow(`Could not find 'new App' expression`);
  expect(visitCount).toEqual(0);
});

test('visitNewAppExpression multiple matches', async () => {
  let visitCount = 0;
  const plugin = ({types}) => {
    return {
      visitor: visitNewAppExpression(types, () => {
        visitCount++;
      }),
    };
  };
  expect(() =>
    transform(
      `
    import App from 'fusion-react';

    console.log(App);
    App.test();
    const app = new App(<div />);
    const otherApp = new App(<div />);
  `,
      plugin
    )
  ).toThrow(`Found 2 'new App' expressions. Expected 1`);
  expect(visitCount).toEqual(0);
});

function transform(code, plugin) {
  return babel.transform(code, {
    plugins: [plugin],
    babelrc: false,
    parserOpts: {
      plugins: ['jsx', 'flow', 'classProperties', 'objectRestSpread'],
    },
  });
}
