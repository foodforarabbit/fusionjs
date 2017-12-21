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

### Troubleshooting

If you see the error `'Received an unexpected value [object Object]`, you probably forgot to call `.toSource()` at the end.
