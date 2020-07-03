#!/usr/bin/env node

const inquirer = require('inquirer');
const path = require('path');
const createAppDefinition = require('./create-app-definition');

let appDefinitionSettings;

(async () => {
  appDefinitionSettings = await inquirer.prompt([
    {
      name: 'name',
      message: `App name (${path.basename(process.cwd())}):`
    },
    {
      name: 'locations',
      message: 'Select locations for this app:',
      type: 'checkbox',
      choices: [
        { name: 'Entry field (entry-field) ', value: 'entry-field' },
        { name: 'Entry editor (entry-editor)', value: 'entry-editor' },
        { name: 'Entry sidebar (entry-sidebar) ', value: 'entry-sidebar' },
        { name: 'Page (page) ', value: 'page' },
        { name: 'Dialog (dialog) ', value: 'dialog' }
      ]
    },
    {
      name: 'fields',
      message: 'Select field types:',
      type: 'checkbox',
      choices: [
        { name: 'Symbol' },
        { name: 'Symbols' },
        { name: 'Text' },
        { name: 'RichText' },
        { name: 'Integer' },
        { name: 'Number' },
        { name: 'Date' },
        { name: 'Boolean' },
        { name: 'Object' },
        { name: 'Entry' },
        { name: 'Entries' },
        { name: 'Asset' },
        { name: 'Assets' }
      ],
      when(answers) {
        return answers.locations.includes('entry-field');
      },
      validate(answers) {
        if (answers.length < 1) {
          return 'You must choose at least one field type.';
        }
        return true;
      }
    }
  ]);

  // Add app-config automatically
  appDefinitionSettings.locations = ['app-config', ...appDefinitionSettings.locations];

  await createAppDefinition(appDefinitionSettings);
})();
