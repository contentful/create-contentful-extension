// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
const createJestConfig = require('./utils/createJestConfig');
const paths = require('./utils/paths');
const fs = require('fs-extra');
const jest = require('jest');

const argv = process.argv.slice(2);

let appPackageJson = {};

try {
  appPackageJson = fs.readJSONSync(paths.packageJson);
} catch (e) {
  // do nothing
}

process.on('unhandledRejection', err => {
  throw err;
});

argv.push(
  '--config',
  JSON.stringify(Object.assign({}, createJestConfig(), appPackageJson.jest || {}))
);

jest.run(argv);
