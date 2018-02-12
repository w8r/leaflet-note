import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import progress from 'rollup-plugin-progress'
import filesize from 'rollup-plugin-filesize'
import buble from 'rollup-plugin-buble';

const pkg = require('./package.json');
const leafletModuleName = 'L.Note';

const plugins = (minify) => {
  const list = [
    commonjs({
      sourceMap: false,
      include: 'node_modules/**',
    }),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
      jsnext: true,
      main: true
    }),
    buble(),

    // Extras
    progress({
      clearLine: false,
    }),
    filesize(),
  ];

  if (minify) {
    list.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      uglify({ output: { comments: 'some' }})
    );
  }
  return list;
}

export default [{
  entry: 'src/index.js',
  dest: pkg.browser,
  format: 'umd',
  moduleName: pkg.name,
  external: ['leaflet'],
  globals: {
    'leaflet': 'L'
  },
  plugins: plugins(false),
}, {
  entry: 'src/index.js',
  dest: pkg.minified,
  format: 'umd',
  moduleName: pkg.name,
  external: ['leaflet'],
  globals: {
    'leaflet': 'L'
  },
  plugins: plugins(true),
},{
  entry: 'tests/index.js',
  dest: 'tests/build.js',
  format: 'iife',
  plugins: plugins(false),
}, {
  entry: 'demo/index.js',
  dest: 'demo/build.js',
  format: 'iife',
  plugins: plugins(false),
}]
