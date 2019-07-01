/* eslint-disable no-console */

const chalk = require('chalk');

module.exports = () => {
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  npm run start`));
  console.log(
    '    Starts the development server and deploys the extension in development mode'
  );
  console.log();
  console.log(chalk.cyan(`  npm run build`));
  console.log('    Bundles the extension for production.');
  console.log();
  console.log(chalk.cyan(`  npm run test`));
  console.log(
    '    Run jest runner in watch mode. Passes through all flats directly to Jest'
  );
  console.log();
  console.log(chalk.cyan(`  npm run configure`));
  console.log(
    '    Asks which space and environment you want to use for development and deployment.'
  );
  console.log();
  console.log(chalk.cyan(`  npm run login`));
  console.log(
    '    Starts new session with our CLI. As the CLI tool uses our Content Management API, you need to have an CMA access token to use all the commands.'
  );
  console.log();
  console.log(chalk.cyan(`  npm run logout`));
  console.log('    Ends your current session with the CLI tool.');
  console.log();
  console.log(chalk.cyan(`  npm run deploy`));
  console.log(
    '    Bundles the extension for production and deploys bundled version to Contentful'
  );
  console.log();
  console.log(chalk.cyan(`  npm run help`));
  console.log('    Shows this help information one more time');
  console.log();
};
