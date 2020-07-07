#!/usr/bin/env node

const fetch = require('node-fetch');
const { createClient } = require('contentful-management');
const inquirer = require('inquirer');
const { managementToken } = require('../.contentfulrc.json');

const client = createClient({
  accessToken: managementToken
});

async function fetchOrganizations() {
  try {
    orgs = await client.getOrganizations();

    return orgs.items.map(org => ({
      name: `${org.name} (${org.sys.id})`,
      value: org.sys.id
    }));
  } catch (err) {
    console.log();
    console.log(
      'We couldnt find your organizations. Please make sure you provided an access token'
    );
    console.log();
    console.log(err.message);
    process.exit(1);
  }
}

module.exports = async function createAppDefition(appDefinitionSettings = {}) {
  let selectedOrg;

  const organizations = await fetchOrganizations();

  const { organizationId } = await inquirer.prompt([
    {
      name: 'organizationId',
      message: 'Select an organization for your app:',
      type: 'list',
      choices: organizations
    }
  ]);
  selectedOrg = organizations.find(org => org.value === organizationId);

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

  try {
    const organization = await client.getOrganization(organizationId);
    const createdAppDefition = await organization.createAppDefinition(body);

    console.log();
    console.log(
      `App ${appDefinitionSettings.name} has been successfully created in ${selectedOrg.name}`
    );
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
  } catch (err) {
    console.log();
    console.log(
      'Something went wrong with creating app definition. Run `npm run configure` to try again.'
    );
    console.log();
    console.log(err.message);
    process.exit(1);
  }
};
