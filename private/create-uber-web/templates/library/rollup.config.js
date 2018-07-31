import babel from 'rollup-plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import nodeResolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';

const external = Object.keys(pkg.dependencies);
export default {
  // treat all package dependencies as external so they are not packaged into the dist code
  external,
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    nodeResolve(),
    commonjs(),
    // copy flow file so the flow type is accessible by parent app.
    copy({
      'src/index.js.flow': 'dist/index.js.flow',
      'src/index.es.js.flow': 'dist/index.es.js.flow',
      verbose: true
    }),
    sizeSnapshot()
  ]
};
