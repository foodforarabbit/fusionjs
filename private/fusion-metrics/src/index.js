// @flow
/* eslint-env node */
import type {IntrospectionSchema} from 'fusion-plugin-introspect';

type Store = {
  store(IntrospectionSchema, Object): Promise<void>,
  storeSync(IntrospectionSchema): void,
};

export default (): Store => {
  return __NODE__ && !__DEV__
    ? {
        // data shape is defined here: https://github.com/fusionjs/fusion-plugin-introspect#data-schema
        // FIXME add proper type for heatpipe when available
        async store(data: IntrospectionSchema, {heatpipe}: Object) {
          const uuid = (Math.random() * 1e17).toString(16);
          const service = process.env.SVC_ID;
          const gitRef = process.env.GIT_REF || '';
          await heatpipe
            .asyncPublish(
              {topic: 'hp-unified-logging-fusion-runtime-metadata', version: 2},
              {
                service,
                uuid,
                gitRef,
                nodeVersion: data.runtime.nodeVersion,
                npmVersion: data.runtime.npmVersion,
                yarnVersion: data.runtime.yarnVersion,
                lockFileType: data.runtime.lockFileType,
              }
            )
            .catch(fail);
          for (const dependency in data.runtime.dependencies) {
            const version = data.runtime.dependencies[dependency];
            await heatpipe
              .asyncPublish(
                {
                  topic:
                    'hp-unified-logging-fusion-runtime-dependency-version-usage',
                  version: 2,
                },
                {
                  service,
                  uuid,
                  gitRef,
                  dependency,
                  version,
                }
              )
              .catch(fail);
          }
        },
        storeSync(data: IntrospectionSchema) {
          // eslint-disable-next-line
          console.log(JSON.stringify(data, null, 2)); // logged data goes to kafka. We use vanilla console here because storeSync may be called before DI graph is resolved (i.e. before logtron is available)
        },
      }
    : ((undefined: any): Store);
};

function fail(e) {
  // eslint-disable-next-line
  console.log(new Error('Failed to publish to heatpipe'));
}
