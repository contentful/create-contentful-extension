/* eslint-disable no-console */

process.env.NODE_ENV = 'production';

const Bundler = require('parcel-bundler');
const paths = require('./utils/paths');

const entry = paths.src + '/index.js';

// Bundler options
const options = {
  outDir: paths.build, // The out directory to put the build files in, defaults to dist
  outFile: 'index.js', // The name of the outputFile
  watch: false, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  contentHash: false, // Disable content hash from being included on the filename
  minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors
  hmr: false, // Enable or disable HMR while watching
  sourceMaps: false, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  detailedReport: true, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
};

const bundler = new Bundler(entry, options);

const run = async () => {
  await bundler.bundle();
};

run();
