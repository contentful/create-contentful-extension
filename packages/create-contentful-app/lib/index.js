#!/usr/bin/env node

/* eslint-disable no-console, no-process-exit */

const chalk = require('chalk');
const spawn = require('cross-spawn');
const Spinner = require('cli-spinner').Spinner;
const appFolder = process.argv[2];

if (!appFolder) {
  console.log();
  console.log(
    chalk.red(`Please provide a name for your app. E.g: "npx create-contentful-app my-app"`)
  );
  console.log();
  process.exit(1);
}

function onSuccess(spinner, folder) {
  spinner.stop(true);

  console.log();
  console.log(chalk.blue(`Success! Initialized "${folder}" in ~/${folder}.`));
  console.log();
  console.log(chalk.blue(`We suggest that you begin by running:`));
  console.log();
  console.log(chalk.green(`   cd ${folder}`));
  console.log(chalk.green(`   npm run configure`));
  console.log();
  process.exit();
}

try {
  const spinner = new Spinner(chalk.blue(`Creating a Contentful App: ${appFolder} %s`));
  spinner.setSpinnerString('/-\\');

  const command = 'npx';
  const args = ['create-react-app', appFolder, '--template', `file:${__dirname}/../`, '--silent'];

  const appCreateProcess = spawn(command, args, {
    silent: true
  });

  // start creating app
  spinner.start();
  appCreateProcess.on('exit', onSuccess.bind(null, spinner, appFolder));
} catch (err) {
  console.log(
    chalk.red(`Failed to create ${appFolder}:
      
      ${err}
    `)
  );
}
