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
    local: 'contentful extension update --src http://localhost:1234 --force',
    publish: 'npm run build && contentful extension update --force',
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
  console.log(chalk.cyan(`  ${displayedCommand} local`));
  console.log(
    '    Publishes version running in development mode to Contentful'
  );
  console.log(chalk.cyan(`  ${displayedCommand} publish`));
  console.log(
    '    Bundles the extension for production and publishes bundled version to Contentful'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(
    `  ${chalk.cyan(`${displayedCommand} local && ${displayedCommand} start`)}`
  );
  console.log();
  console.log('Happy hacking and enjoy Contentful!');
};
