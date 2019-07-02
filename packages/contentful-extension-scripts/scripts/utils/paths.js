const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  packageJson: resolveApp('package.json'),
  root: resolveApp('.'),
  src: resolveApp('src'),
  build: resolveApp('build'),
  cache: resolveApp('.cache'),
  coverage: resolveApp('.coverage')
};
