const uratePlugin = require('../plugin');

jest.mock('@dubstep/core', () => {
  const actual = require.requireActual('@dubstep/core');
  return {
    ...actual,
    withJsFiles: jest.fn(),
    withJsFile: jest.fn(),
  };
});

test('uratePlugin', async () => {
  const dub = require('@dubstep/core');
  dub.withJsFiles.mockImplementationOnce((glob, handler) => {
    const src = `
import initUrate from '@uber/urate-widget/server';
import UrateWidget from '@uber/urate-widget';
console.log('test');
initUrate();
UrateWidget({
  a: 'test',
  b: 'something',
});
`;
    let path = dub.parseJs(src);
    handler(path);
    expect(dub.generateJs(path)).toMatchInlineSnapshot(`
"
console.log('test');
"
`);
  });
  dub.withJsFile.mockImplementationOnce((file, handler) => {
    const src = `
import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react';
export default function main() {
  const app = new App();
  app.enhance(FetchToken, CsrfProtectionPlugin);
}
`;
    let path = dub.parseJs(src);
    handler(path);
    expect(dub.generateJs(path)).toMatchInlineSnapshot(`
"
import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react';
import UratePlugin, { UrateConfigToken, UrateToken } from \\"@uber/fusion-plugin-urate\\";
export default function main() {
  const app = new App();
  app.enhance(FetchToken, CsrfProtectionPlugin);

  app.register(UrateConfigToken, {
    a: 'test',
    b: 'something',
  });

  app.register(UrateToken, UratePlugin);
}
"
`);
  });
  await uratePlugin.step();
});
