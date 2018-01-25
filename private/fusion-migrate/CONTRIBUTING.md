# Setting up for development

* `git clone gitolite@code.uber.internal:web/fusion-migrate && cd fusion-migrate`
* `yarn install`
* `yarn run clean` - resets `fixture/test.js` file
* `yarn run build` - run all migrations scripts on `fixture/test.js`

Files in `src/codemods` (excluding child directories) are considered codemods, and are run in series by `yarn run build`

Codemods can be composed via `src/codemods/utils/compose`. Use `compose` to run several related codemods together. See `src/codemods/plugin-to-di-secrets.js` for an example.

Migrations are written with [jscodeshift](https://github.com/facebook/jscodeshift). For the most part, migrations are some variation of this:

```js
module.exports = ({source}, {jscodeshift: j}) => {
  return j(source)
    .find(someToken, somePartialEstreeAst)
    .replaceWith(p => {
      return someEstreeAst;
    })
    .toSource();
};
```

* `someToken` is something like `j.Identifier`, `j.CallExpression`, etc. (notice it's upper-case). See [estree](https://github.com/estree/estree/) to find what the AST node names are.
* `somePartialEstreeAst` is a structure that will serve as the matching criteria. For example, `{name: 'Foo'}` will match `Foo` (whose full AST is `{type: 'Identifier', name: 'Foo'}`. When writing migrations, make sure `somePartialEstreeAst` is specific enough.
* `someEstreeAst` can be constructed via helper functions such as `j.identifier`, `j.callExpression`, etc. The function arguments map to the properties of their respective nodes in the estree spec. For example:

```js
j.expressionStatement(
  j.callExpression(j.identifier('foo'), [j.identifier('bar')])
);
```

is equivalent to:

```js
{
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'foo',
    },
    arguments: [{
      type: 'Identifier',
      name: 'bar',
    }]
  },
}
```

which is equivalent to:

```
foo(bar)
```

* `p.node` has the parsed value of the AST before the transformation. This is useful for reusing values from the existing AST when building the replacement AST.

### Composite codemods

Sometimes you need to do many things as part of a single logical codemod. To compose multiple codemods, use `compose`:

```js
const compose = require('./utils/compose');

module.exports = compose(
  ({source}, {jscodeshift: j}) => {
    // codemod goes here
  },
  ({source}, {jscodeshift: j}) => {
    // codemod goes here
  }
);
```

### String codemods

If you know the exact string you want to replace, you can do a simple string replacement. Be careful to not mess up indentation!

```js
module.exports = ({source}) => {
  return source.replace(`use 'strong'`, `use 'strict'`);
};
```

### Bumping library versions

Use `bump-version` to change the version of a library in `package.json`:

```js
const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('my-library', '^0.1.0'),
  ({source}, {jscodeshift: j}) => {
    // codemod goes here
  }
);
```

### Adding/removing libraries

Use `add-package` and `remove-package` to add/remove packages in `package.json`:

When adding packages, you need to specify whether the package should go in `dependencies`, `devDependencies` or `peerDependencies`.

```js
const compose = require('../utils/compose');
const add = require('../utils/add-package');
const remove = require('../utils/remove-package');

module.exports = compose(
  add('devDependencies', 'my-library', '^0.1.0'),
  remove('my-old-library')
);
```

### Order of codemods

Codemods run in alphabetical order of their file names. The easiest way to make a set of codemods run after another set of codemods is to increment the number at the beginning of the filename for the codemods that needs to be run last.

### Troubleshooting

If you see the error `'Received an unexpected value [object Object]`, you probably forgot to call `.toSource()` at the end.
