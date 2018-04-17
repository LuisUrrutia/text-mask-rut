/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')));
const babelConfig = babelrc.env.legacy;

export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/legacy/index.js',
    format: 'cjs',
    name: 'text-mask-rut',
    sourcemap: true,
  },
  plugins: [
    sourcemaps(),
    babel({
      ...babelConfig,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    resolve(),
    commonjs(),
    uglify({
      mangle: {
        reserved: ['createRutMask'],
      },
    }),
  ],
};
