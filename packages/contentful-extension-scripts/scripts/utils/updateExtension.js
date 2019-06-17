const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async (https, port) => {
  await exec(
    `contentful extension update --src ${
      https ? 'https' : 'http'
    }://localhost:${port} --force`
  );
};
