// @flow
/* eslint-env node */
import formatStdout from '../src/utils/format-stdout';

let message = 'hahaha';
let stringMeta = 'metametameta';
let objectMeta = {a: 1, b: 2, c: 'apple'};

['production', 'development'].forEach(env => {
  ['error', 'info'].forEach(level => {
    test(`format stdout with object meta, level: ${level}, env: ${env} `, () => {
      expect.assertions(1);
      const output = formatStdout(
        {
          level,
          message,
          meta: objectMeta,
        },
        env === 'production'
      );
      expect(
        getFormatPattern(env, level, message, objectMeta).test(output)
      ).toBeTruthy();
    });

    test(`format stdout with string meta, level: ${level}, env: ${env} `, () => {
      expect.assertions(1);
      const output = formatStdout(
        {
          level,
          message,
          meta: stringMeta,
        },
        env === 'production'
      );
      expect(
        getFormatPattern(env, level, message, stringMeta).test(output)
      ).toBeTruthy();
    });
  });
});

function getFormatPattern(env, level, message, meta): RegExp {
  if (meta === objectMeta) {
    if (env === 'production') {
      return new RegExp(
        `\\"level\\"\\:\\"${level}\\".*\\"msg\\"\\:\\"${message}\\".*\\"fields\\"\\:\\{\\"a\\":1,\\"b\\":2,\\"c\\":\\"apple\\"\\}`
      ); // based on `utils/format-stdout.js`
    }
    return new RegExp(`${level}.*:.*${message} a=1, b=2, c=apple`);
  }
  if (meta === stringMeta) {
    if (env === 'production') {
      return new RegExp(
        `\\"level\\"\\:\\"${level}\\".*\\"msg\\"\\:\\"${message}\\".*\\"fields\\"\\:\\"${stringMeta}\\"`
      ); // based on `utils/format-stdout.js`
    }
    return new RegExp(`${level}.*:.*${message} ${stringMeta}`);
  }
  // keep flow happy
  return /fail/;
}
