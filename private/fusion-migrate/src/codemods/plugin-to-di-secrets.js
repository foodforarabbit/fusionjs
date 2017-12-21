const compose = require('./utils/compose');

module.exports = compose(
  ({source}, {jscodeshift: j}) => {
    /*
    ```
    import SecretsPlugin from '@uber/fusion-plugin-secrets';
    ```
    becomes
    ```
    import SecretsPlugin, {SecretsToken, SecretsConfigToken} from '@uber/fusion-plugin-secrets';
    ```
    */
    return j(source)
      .find(j.ImportDeclaration, {
        specifiers: [{local: {name: 'SecretsPlugin'}}],
      })
      .replaceWith(p => {
        return j.importDeclaration(
          [
            j.importDefaultSpecifier(j.identifier('SecretsPlugin')),
            j.importSpecifier(j.identifier('SecretsToken')),
            j.importSpecifier(j.identifier('SecretsConfigToken')),
          ],
          j.literal('@uber/fusion-plugin-secrets')
        );
      })
      .toSource();
  },
  ({source}, {jscodeshift: j}) => {
    /*
    ```
    const Secrets = app.plugin(SecretsPlugin, devSecretsConfig);
    ```
    becomes
    ```
    app.register(SecretsToken, SecretsPlugin);
    app.register(SecretsConfigToken, devSecretsConfig);
    ```
    */
    return j(source)
      .find(j.VariableDeclaration, {
        kind: 'const',
        declarations: [
          {
            id: {name: 'Secrets'},
            init: {
              callee: {object: {name: 'app'}, property: {name: 'plugin'}},
              arguments: [{name: 'SecretsPlugin'}, {name: 'devSecretsConfig'}],
            },
          },
        ],
      })
      .insertBefore(p => {
        return j.expressionStatement(
          j.callExpression(
            j.memberExpression(j.identifier('app'), j.identifier('register')),
            [j.identifier('SecretsToken'), j.identifier('SecretsPlugin')]
          )
        );
      })
      .insertBefore(p => {
        return j.expressionStatement(
          j.callExpression(
            j.memberExpression(j.identifier('app'), j.identifier('configure')),
            [
              j.identifier('SecretsConfigToken'),
              j.identifier('devSecretsConfig'),
            ]
          )
        );
      })
      .remove()
      .toSource();
  }
);
