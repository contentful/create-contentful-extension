/* eslint-disable no-console */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const chalk = require('chalk');
const generateExtensionFile = require('./utils/generateExtensionFile');
const updatePackageJsonFile = require('./utils/updatePackageJsonFile');

module.exports = (appPath, payload, originalDirectory) => {
  const { name, type, fields } = payload;

  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  let appPackage = require(path.join(appPath, 'package.json'));

  appPackage = updatePackageJsonFile(appPackage);

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  fs.writeFileSync(
    path.join(appPath, 'extension.json'),
    JSON.stringify(generateExtensionFile(name, type, fields), null, 2) + os.EOL
  );

  const templates = [
    path.join(ownPath, 'template', 'common'),
    path.join(ownPath, 'template', type),
  ];

  templates.forEach(path => {
    if (fs.existsSync(path)) {
      fs.copySync(path, appPath);
    }
  });

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, name) === appPath) {
    cdpath = name;
  } else {
    cdpath = appPath;
  }

  const displayedCommand = 'npm run';

  console.log();
  console.log(`Success! Created ${name} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} build`));
  console.log('    Bundles the extension for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} dev:publish`));
  console.log(
    '    Publishes version running in development mode to Contentful'
  );
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} publish`));
  console.log(
    '    Bundles the extension for production and publishes bundled version to Contentful'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(
    `  ${chalk.cyan(
      `${displayedCommand} dev:publish && ${displayedCommand} start`
    )}`
  );
  console.log();
  console.log('Happy hacking and enjoy Contentful!');
};
