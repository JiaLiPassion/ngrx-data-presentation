import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

module.exports = {
  input: 'build/index.js',
  output: {file: 'dist/bundle.js', format: 'umd', name: 'godemo'},
  plugins: [nodeResolve({jsnext: true, main: true}), commonjs({})]
};