/* eslint-disable no-console */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const chalk = require('chalk');
const generateExtensionFile = require('./utils/generateExtensionFile');
const updatePackageJsonFile = require('./utils/updatePackageJsonFile');
const showHelp = require('./utils/showHelp');
const { version } = require('../package.json');

module.exports = (appPath, payload, originalDirectory) => {
  const { name, type, fields, language } = payload;
  const currentLanguage = language || 'javascript';

  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  let appPackage = require(path.join(appPath, 'package.json'));

  appPackage = updatePackageJsonFile(appPackage, {
    version,
    language: currentLanguage,
    type,
  });

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
    path.join(ownPath, 'template', currentLanguage),
    path.join(ownPath, 'template', currentLanguage + '-' + type),
  ];

  templates.forEach(path => {
    if (fs.existsSync(path)) {
      fs.copySync(path, appPath);
    }
  });

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
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
  if (originalDirectory && path.join(originalDirectory, name) === appPath) {
    cdpath = name;
  } else {
    cdpath = appPath;
  }

  console.log();
  console.log(`Success! Created ${name} at ${appPath}`);

  showHelp();

  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(
    `  ${chalk.cyan(
      `npm install && npm run login && npm run configure && npm run start`
    )}`
  );
  console.log();
  console.log('Happy hacking and enjoy Contentful UI Extensions!');
};
