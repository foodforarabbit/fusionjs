// @flow

import {readFile} from '@dubstep/core';

import {withJsFiles} from '../../utils/with-js-files.js';

type Options = {
  dir: string,
};

export const addStyledGeneric = async ({dir}: Options) => {
  await withJsFiles(dir, async (root, file) => {
    const data = await readFile(file).catch(() => '');
    if (data.includes('@noflow')) return;

    root.traverse({
      CallExpression(p) {
        let typeId = '';
        // is styled() call
        if (
          p.node.callee.type === 'Identifier' &&
          p.node.callee.name === 'styled' &&
          !p.node.typeArguments
        ) {
          // is styled('tag', () => {})
          if (
            p.node.arguments.length === 2 &&
            p.node.arguments[0].type === 'StringLiteral' &&
            p.node.arguments[1].type.includes('Function')
          ) {
            const params = p.node.arguments[1].params;
            if (params.length > 0) {
              // is styled('tag', (foo: Foo) => {})
              if (
                params[0].typeAnnotation &&
                params[0].typeAnnotation.typeAnnotation &&
                params[0].typeAnnotation.typeAnnotation.id
              ) {
                typeId = params[0].typeAnnotation.typeAnnotation.id.name;
              } else {
                typeId = 'any';
              }
            }
          } else if (
            p.node.arguments.length === 2 &&
            p.node.arguments[0].type === 'Identifier' &&
            p.node.arguments[1].type.includes('Function')
          ) {
            typeId = 'any, any';
          }
        }
        if (typeId) {
          p.node.callee.name += `<${typeId}>`;
        }
      },
    });
  });
};
