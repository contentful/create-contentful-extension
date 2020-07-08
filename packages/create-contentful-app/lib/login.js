/* eslint-disable no-console, no-process-exit */

const spawn = require('cross-spawn');
const inquirer = require('inquirer');

module.exports = async function login() {
  try {
    const mainCommand = 'open';
    const redirectUrl = 'https://www.contentful.com/developers/cli-oauth-page/';
    const oauthUrl = `https://be.contentful.com/oauth/authorize?response_type=token&scope=content_management_manage&client_id=9f86a1d54f3d6f85c159468f5919d6e5d27716b3ed68fd01bd534e3dea2df864&&redirect_uri=${encodeURIComponent(
      redirectUrl
    )}`;
    const args = [oauthUrl];
    spawn(mainCommand, args, {
      silent: true
    });

    const { mgmtToken } = await inquirer.prompt([
      {
        name: 'mgmtToken',
        message: 'Please paste your management token: ',
        validate(answer) {
          if (!answer) {
            return "Unfortunately, we can't proceed without a contentful management token";
          }

          return true;
        }
      }
    ]);

    return mgmtToken;
  } catch (err) {
    console.log('Failed to login into contentful');
    console.log(err.message);
    process.exit(1);
  }
};
