/* eslint-disable no-console, no-process-exit */

process.env.NODE_ENV = 'production';

const argv = require('yargs').argv;

const Bundler = require('parcel-bundler');
const urlLoader = require('parcel-plugin-url-loader');
const chalk = require('chalk');
const fs = require('fs');
const paths = require('./utils/paths');
const postHTML = require('posthtml');
const posthtmlInlineAssets = require('posthtml-inline-assets');
const htmlnano = require('htmlnano');

const shouldInlineAssets = argv.inline === false ? false : true;
const shouldProduceSourceMaps = shouldInlineAssets === false;
const publicUrl = argv.publicUrl || './';

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const entry = paths.src + '/index.html';

// Bundler options
const options = {
  outDir: paths.build, // The out directory to put the build files in, defaults to dist
  publicUrl: publicUrl,
  outFile: 'index.html', // The name of the outputFile
  target: 'browser',
  watch: false, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: true, // Enabled or disables caching, defaults to true
  contentHash: true, // Include a content hash in the outputted filenames
  minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors
  hmr: false, // Enable or disable HMR while watching
  sourceMaps: shouldProduceSourceMaps, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  detailedReport: true, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  autoInstall: false // Disable auto install
};

const inlineAssets = async () => {
  const ENC = { encoding: 'utf8' };

  const read = file => fs.readFileSync(file, ENC);

  let html = read(paths.build + '/index.html');

  const result = await postHTML([
    posthtmlInlineAssets({
      cwd: paths.build
    }),
    htmlnano()
  ]).process(html);
  html = result.html;

  const LIMIT = 1024 * 512;
  const extensionSize = Buffer.byteLength(html);

  console.log();
  console.log(
    'Extension size: ' + bytesToSize(extensionSize) + ' from ' + bytesToSize(LIMIT) + ' allowed.'
  );
  console.log();

  if (extensionSize > LIMIT) {
    console.error(
      chalk.red('Your extensions exceeds max size. It cannot be hosted by Contentful.')
    );
    console.log();
    process.exit(0);
  }

  fs.writeFileSync(paths.build + '/index.html', html, ENC);
};

const bundler = new Bundler(entry, options);

const run = async () => {
  try {
    await urlLoader(bundler);
    await bundler.bundle();
    if (shouldInlineAssets) {
      await inlineAssets();
    }
  } catch (e) {
    console.log();
    console.error(chalk.red(e.message));
    process.exit(1);
  }
};

run();
