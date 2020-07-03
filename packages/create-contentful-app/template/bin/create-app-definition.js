#!/usr/bin/env node

const fetch = require('node-fetch');
const inquirer = require('inquirer');
const Tokens = require('../.contentfulrc.json');

const BASE_URL = `https://${Tokens.host}/organizations/`;

async function fetchOrganizations() {
  const orgs = await fetch(BASE_URL, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Tokens.managementToken}`
    }
  }).then(res => res.json());

  return orgs.items.map(org => ({
    name: `${org.name} (${org.sys.id})`,
    value: org.sys.id
  }));
}

module.exports = async function createAppDefition(appDefinitionSettings) {
  const organizations = await fetchOrganizations();

  const { organization } = await inquirer.prompt([
    {
      name: 'organization',
      message: 'Select an organization for your app:',
      type: 'list',
      choices: organizations
    }
  ]);
  const { name } = organizations.find(org => org.value === organization);

  const body = {
    name: appDefinitionSettings.name,
    src: 'http://localhost:3000',
    locations: appDefinitionSettings.locations.map(location => {
      if (location === 'entry-field') {
        return {
          location,
          fieldTypes: appDefinitionSettings.fields.map(field => ({
            type: field
          }))
        };
      }

      return {
        location
      };
    })
  };

  const createdAppDefition = await fetch(`${BASE_URL}/${organization}/app_definitions`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Tokens.managementToken}`
    }
  }).then(res => res.json());

  console.log();
  console.log(`App ${appDefinitionSettings.name} has been successfully created in ${name}`);
  console.log();
  console.log();
  console.log(`Next steps: `);
  console.log(
    `   1. To develop, run \`npm start\` and open https://app.contentful.com/deeplink?link=apps&id=${createdAppDefition.sys.id}`
  );
  console.log(
    `   2. To learn how to build your first Contentful app, visit https://ctfl.io/app-tutorial`
  );
  console.log();
};
