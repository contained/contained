/* eslint-disable */
'use strict';

const fs = require('fs');
const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs  = require('rollup-plugin-commonjs');
const pkg = require('../package.json');

const bundles = [
  {
    format: 'cjs', ext: '.js', plugins: [],
    babelPresets:[['@babel/preset-env',{modules: false}]], babelPlugins: [
      "@babel/plugin-proposal-class-properties",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-transform-runtime"
    ]
  },
  {
    format: 'es', ext: '.mjs', plugins: [],
    babelPresets: [['@babel/preset-env',{modules: false}]], babelPlugins: [
      "@babel/plugin-proposal-class-properties",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-transform-runtime"
    ]
  }
];

let promise = Promise.resolve();

// Clean up the output directory
promise = promise.then(() => del(['dist/*']));

// Compile source code into a distributable format with Babel and Rollup
for (const config of bundles) {
  promise = promise.then(() => rollup.rollup({
    input: 'src/Contained.js',
    external: Object.keys(pkg.dependencies),
    plugins: [
      commonjs(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: config.babelPresets,
        plugins: config.babelPlugins,
        runtimeHelpers: true
      })
    ].concat(config.plugins),
  }).then(bundle => bundle.write({
    file: `dist/${config.moduleName || 'main'}${config.ext}`,
    format: config.format,
    sourceMap: !config.minify,
    moduleName: config.moduleName,
  })));
}

// Copy package.json and LICENSE.txt
promise = promise.then(() => {
  delete pkg.private;
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg.eslintConfig;
  delete pkg.babel;
  fs.writeFileSync('dist/LICENSE.txt', fs.readFileSync('LICENSE', 'utf-8'), 'utf-8');
});

promise.catch(err => console.error(err.stack)); // eslint-disable-line no-console
