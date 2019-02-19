/* eslint-disable no-console */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const chalk = require('chalk');

module.exports = (appPath, appName, originalDirectory) => {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  const appPackage = require(path.join(appPath, 'package.json'));

  appPackage.dependencies = appPackage.dependencies || {};
  appPackage.scripts = {
    start: 'contentful-extension-scripts start',
    build: 'contentful-extension-scripts build',
    'extension:create': 'contentful extension create',
    'extension:update': 'contentful extension update --force',
    'extension:local':
      'contentful extension update --force --src http://localhost:1234/',
  };
  appPackage.browserslist = ['last 5 Chrome version', '> 1%', 'not ie <= 11'];

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  fs.writeFileSync(
    path.join(appPath, 'extension.json'),
    JSON.stringify(
      {
        id: appName,
        name: appName,
        srcdoc: './build/index.html',
        fieldTypes: ['Symbol'],
      },
      null,
      2
    ) + os.EOL
  );

  const templatePath = path.join(ownPath, 'template');

  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  }

  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    );
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'));
      fs.appendFileSync(path.join(appPath, '.gitignore'), data);
      fs.unlinkSync(path.join(appPath, 'gitignore'));
    } else {
      throw err;
    }
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  const displayedCommand = 'npm run';

  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} build`));
  console.log('    Bundles the extension for production.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  console.log();
  console.log('Happy hacking and enjoy Contentful!');
};
