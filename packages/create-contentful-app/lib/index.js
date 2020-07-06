#!/usr/bin/env node

/* eslint-disable no-console, no-process-exit */

const spawn = require('cross-spawn');
const path = require('path');
const Spinner = require('cli-spinner').Spinner;
const appFolder = process.argv[2];

if (!appFolder) {
  console.log();
  console.log(`Please provide a name for your app. E.g: "npx create-contentful-app my-app"`);
  console.log();
  process.exit(1);
}

function onSuccess(spinner, folder) {
  spinner.stop(true);

  console.log();
  console.log(`Success! Initialized "${folder}" in ~/${folder}.`);
  console.log();
  console.log(`We suggest that you begin by running:`);
  console.log();
  console.log(`   cd ${folder}`);
  console.log(`   npm run configure`);
  console.log();
  process.exit();
}

try {
  const spinner = new Spinner(`Creating a Contentful App: ${appFolder} %s`);
  spinner.setSpinnerString('/-\\');

  const command = 'npx';
  const execPath = path.resolve(__dirname, '../');

  const args = ['create-react-app', appFolder, '--template', `file:${execPath}`, '--silent'];

  const appCreateProcess = spawn(command, args, {
    silent: true
  });

  // start creating app
  spinner.start();
  appCreateProcess.on('exit', onSuccess.bind(null, spinner, appFolder));
} catch (err) {
  console.log(
    `Failed to create ${appFolder}:
      
      ${err}
    `
  );
}
