/* eslint-disable no-console */

const displayedCommand = 'npm run';

const chalk = require('chalk');

module.exports = () => {
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log(
    '    Starts the development server and deploys the extension in development mode'
  );
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} build`));
  console.log('    Bundles the extension for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} login`));
  console.log(
    '    Starts new session with our CLI. As the CLI tool uses our Content Management API, you need to have an CMA access token to use all the commands.'
  );
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} logout`));
  console.log('    Ends your current session with the CLI tool.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} deploy`));
  console.log(
    '    Bundles the extension for production and deploys bundled version to Contentful'
  );
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} help`));
  console.log('    Shows this help information one more time');
  console.log();
};
