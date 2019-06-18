/* eslint-disable no-console */

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');

module.exports = async (port, https) => {
  console.log(chalk.cyan(`Installing extension in development mode...`));
  const { stdout } = await exec(
    `contentful extension update --src ${
      https ? 'https' : 'http'
    }://localhost:${port} --force`
  );
  console.log(stdout);
};
