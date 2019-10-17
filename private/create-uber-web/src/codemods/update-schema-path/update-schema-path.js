// @flow
import {join} from 'path';
import {existsSync} from 'fs';

import {withJsonFile} from '@dubstep/core';

type Options = {
  dir: string,
};

export async function updateSchemaPath(opts: Options) {
  const {dir} = opts;
  const filePath = join(dir, '.graphqlconfig');
  if (existsSync(filePath)) {
    await withJsonFile(filePath, data => {
      data.schemaPath = '.graphql/schema.graphql';
      return Promise.resolve();
    });
  }
}
