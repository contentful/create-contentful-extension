/* eslint-disable no-console, no-process-exit */

process.env.NODE_ENV = 'production';

const Bundler = require('parcel-bundler');
const chalk = require('chalk');
const fs = require('fs');
const paths = require('./utils/paths');

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const entry = paths.src + '/index.js';

// Bundler options
const options = {
  outDir: paths.build, // The out directory to put the build files in, defaults to dist
  outFile: 'index.js', // The name of the outputFile
  watch: false, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  contentHash: false, // Disable content hash from being included on the filename
  minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: true, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors
  hmr: false, // Enable or disable HMR while watching
  sourceMaps: false, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  detailedReport: true, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
};

const inlineAssets = async () => {
  const ENC = { encoding: 'utf8' };

  const read = file => fs.readFileSync(file, ENC);

  let js = read(paths.build + '/index.js');

  let css = '';

  try {
    css = read(paths.build + '/index.css');
  } catch (e) {
    // do nothing
  }

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style type="text/css">${css}</style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/javascript">${js}</script>
    </body>
  </html>
  `.trim();

  const LIMIT = 1024 * 500;
  const extensionSize = Buffer.byteLength(html);

  console.log();
  console.log(
    'Extension size: ' +
      bytesToSize(extensionSize) +
      ' from ' +
      bytesToSize(LIMIT) +
      ' allowed.'
  );
  console.log();

  if (extensionSize > LIMIT) {
    console.error(
      chalk.red(
        'Your extensions exceeds max size. It cannot be hosted by Contentful.'
      )
    );
    console.log();
    process.exit(0);
  }

  fs.writeFileSync(paths.build + '/index.html', html, ENC);
};

const bundler = new Bundler(entry, options);

const run = async () => {
  await bundler.bundle();
  await inlineAssets();
};

run();
