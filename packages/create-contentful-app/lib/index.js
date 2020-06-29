#!/usr/bin/env node

const chalk = require('chalk');
const spawn = require('cross-spawn');
const appFolder = process.argv[2];

try {
  spawn('npx', ['create-react-app', appFolder, '--template', `file:${__dirname}/../`], {
    stdio: 'inherit'
  });

  console.log(chalk.blue(`Creating a Contentful App: ${appFolder}`));
} catch (err) {
  console.log(
    chalk.red(`Failed to create ${appFolder}:
      
      ${err}
    `)
  );
}
