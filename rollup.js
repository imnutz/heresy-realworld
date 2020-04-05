import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import includePaths from 'rollup-plugin-includepaths';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'application.js',
  plugins: [
    includePaths({
      include: {
        "@ungap/create-content": "./node_modules/@ungap/degap/create-content.js",
        "@ungap/template-tag-arguments": "./node_modules/@ungap/degap/template-tag-arguments.js",
        "@ungap/weakmap": "./node_modules/@ungap/degap/weakmap.js",
        "@ungap/essential-map": "./node_modules/@ungap/degap/essential-map.js",
        "@ungap/import-node": "./node_modules/@ungap/degap/import-node.js",
        "@ungap/trim": "./node_modules/@ungap/degap/trim.js"
      },
    }),
    resolve({module: true}),
    commonjs({
      namedExports: {
        "sam-pattern": ["createInstance", "api", "doNotRender", "addInitialState", "addComponent", "setRender", "SAM", "step"]
      }
    }),
    // terser()
  ],
  context: null,
  moduleContext: null,
  output: {
    exports: 'named',
    file: 'dist/conduit.js',
    format: 'iife',
    name: 'ConduitApp'
  }
};
