const compose = require('../utils/compose');

const replaceCtxBody = prop => ({source}, {jscodeshift: j}) => {
  return j(source)
    .find(j.MemberExpression, {
      object: {
        object: {name: 'ctx'},
        property: {name: 'body'},
      },
      property: {name: prop},
    })
    .replaceWith(p => {
      return j.memberExpression(
        j.memberExpression(j.identifier('ctx'), j.identifier('template')),
        j.identifier(prop)
      );
    })
    .toSource();
};

module.exports = compose(
  replaceCtxBody('htmlAttrs'), // ctx.body.htmlAttrs => ctx.template.htmlAttrs
  replaceCtxBody('title'), // ctx.body.title => ctx.template.title
  replaceCtxBody('head'), // ctx.body.head => ctx.template.head
  replaceCtxBody('body') // ctx.body.body => ctx.template.body
);
