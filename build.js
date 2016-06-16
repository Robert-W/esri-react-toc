/* eslint-disable no-console, strict */
'use strict';

const pluginBabel = require('rollup-plugin-babel');
const uglify = require('uglify-js');
const rollup = require('rollup');
const fs = require('fs');

const config = {
  src: 'src/toc/Toc-widget.js',
  out: 'dist/Toc-widget.js',
  format: 'amd'
};

// Generate ES6 depending on FORMAT environment variable
rollup.rollup({
  entry: config.src,
  plugins: [pluginBabel()]
}).then(function (bundle) {
  bundle.write({
    dest: config.out,
    format: config.format
  }).then(function () {
    const result = uglify.minify([config.out]);
    fs.writeFileSync(config.out, result.code);
  });
}, console.error);
