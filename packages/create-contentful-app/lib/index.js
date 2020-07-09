#!/usr/bin/env node

/* eslint-disable no-console, no-process-exit */

const spawn = require('cross-spawn');
const path = require('path');
const Spinner = require('cli-spinner').Spinner;
const fetchAppDefinitionSettings = require('./prompt-app-definition');
const createAppDefinition = require('./create-app-definition');

const command = process.argv[2];
const appFolder = process.argv[3];

function onSuccess(spinner, folder) {
  spinner.stop(true);

  console.log();
  console.log(`Success! Initialized "${folder}" in ~/${folder}.`);
  console.log();
  console.log(`We suggest that you begin by running:`);
  console.log();
  console.log(`   cd ${folder}`);
  console.log(`   create-contentful-app create-definition`);
  console.log();
  process.exit();
}

function initProject() {
  try {
    if (!appFolder) {
      console.log();
      console.log(`Please provide a name for your app. E.g: "create-contentful-app init my-app"`);
      console.log();
      process.exit(1);
    }

    const spinner = new Spinner(`Creating a Contentful App: ${appFolder} %s`);
    spinner.setSpinnerString('/-\\');

    const initCommand = 'npx';
    const execPath = path.resolve(__dirname, '../');

    const args = [
      'create-react-app',
      appFolder,
      '--template',
      `file:${execPath}`,
      '--silent',
      '--use-npm'
    ];

    // start creating app
    const appCreateProcess = spawn(initCommand, args, {
      silent: true
    });

    spinner.start();
    appCreateProcess.on('exit', onSuccess.bind(null, spinner, appFolder));
  } catch (err) {
    console.log(
      `Failed to create ${appFolder}:
        
        ${err}
      `
    );
  }
}

(async function main() {
  const mainCommand = 'create-contentful-app';
  let appDefinitionSettings;

  switch (command) {
    case 'init':
      initProject();
      break;

    case 'create-definition':
      appDefinitionSettings = await fetchAppDefinitionSettings();
      await createAppDefinition(appDefinitionSettings);
      break;

    case 'help':
      console.log('Available commands:');
      console.log();
      console.log(`${mainCommand} init app-name`);
      console.log(`   Bootstraps your app inside of a new folder "app-name"`);
      console.log();
      console.log(`${mainCommand} create-definition`);
      console.log(`   Creates an app definition for your app.`);
      console.log(`   This will prompt you to login into Contentful,`);
      console.log(
        `   Paste your access token after obtaining it and select an organization for your app definition`
      );
      console.log();
      break;

    default:
      console.log();
      console.log(`Unknown command. Run "${mainCommand} help" to see available options.`);
      process.exit(1);
  }
})();
