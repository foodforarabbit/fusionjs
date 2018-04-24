const babylon = require('babylon');
const generate = require('@babel/generator').default;
const ensureImportDeclaration = require('../ensure-import-declaration.js');

test('ensureImportDeclaration, specifier, no existing', async () => {
  const parsed = getProgram(`
    import A from 'A';
    import B, {C} from 'C';

    export default function test() {}
  `);
  ensureImportDeclaration(parsed.program.body, `import {Test} from 'test';`);
  expect(generate(parsed).code).toMatchSnapshot();
});

test('ensureImportDeclaration default, no existing', async () => {
  const parsed = getProgram(`
    import A from 'A';
    import B, {C} from 'C';

    export default function test() {}
  `);
  ensureImportDeclaration(parsed.program.body, `import Test from 'test';`);
  expect(generate(parsed).code).toMatchSnapshot();
});

test('ensureImportDeclaration, specifier, with existing', async () => {
  const parsed = getProgram(`
    import A from 'A';
    import B, {C} from 'C';
    import D from 'test';

    export default function test() {}
  `);
  ensureImportDeclaration(parsed.program.body, `import {Test} from 'test';`);
  expect(generate(parsed).code).toMatchSnapshot();
});

test('ensureImportDeclaration default, with existing', async () => {
  const parsed = getProgram(`
    import A from 'A';
    import B, {C} from 'C';
    import {D} from 'test';

    export default function test() {}
  `);
  ensureImportDeclaration(parsed.program.body, `import Test from 'test';`);
  expect(generate(parsed).code).toMatchSnapshot();
});

test('ensureImportDeclaration, specifier, with existing exact', async () => {
  const parsed = getProgram(`
    import A from 'A';
    import B, {C} from 'C';
    import {Test} from 'test';

    export default function test() {}
  `);
  ensureImportDeclaration(parsed.program.body, `import {Test} from 'test';`);
  expect(generate(parsed).code).toMatchSnapshot();
});

test('ensureImportDeclaration default, with existing exact', async () => {
  const parsed = getProgram(`
    import A from 'A';
    import B, {C} from 'C';
    import Test from 'test';

    export default function test() {}
  `);
  ensureImportDeclaration(parsed.program.body, `import Test from 'test';`);
  expect(generate(parsed).code).toMatchSnapshot();
});

test('ensureImportDeclaration multiple', async () => {
  const parsed = getProgram(`
    import A from 'A';
    import B, {C} from 'C';
    import Test, {E, F} from 'test';

    export default function test() {}
  `);
  ensureImportDeclaration(
    parsed.program.body,
    `import Test, {E, G} from 'test';`
  );
  expect(generate(parsed).code).toMatchSnapshot();
});

function getProgram(src) {
  return babylon.parse(src, {sourceType: 'module'});
}
