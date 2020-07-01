#!/usr/bin/env node

const chalk = require('chalk');
const spawn = require('cross-spawn');
const appFolder = process.argv[2];

if (!appFolder) {
  throw new Error(
    chalk.red(`Please provide a name for your app. E.g: "npx create-contentful-app my-app"`)
  );
}

try {
  const command = 'npx';
  const args = ['create-react-app', appFolder, '--template', `file:${__dirname}/../`];
  spawn(command, args, {
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
