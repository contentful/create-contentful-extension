/* eslint-disable no-console, no-process-exit */

const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const os = require('os');
const packageJson = require('../package.json');

let projectName;

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<extension-folder>')
  .usage(`${chalk.green('<extension-folder>')} [options]`)
  .action(name => {
    projectName = name;
  })
  .option('--verbose', 'print additional logs')
  .parse(process.argv);

if (typeof projectName === 'undefined') {
  console.error('Please specify the extension folder:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<extension-folder>')}`
  );
  console.log();
  console.log('For example:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('my-contentful-extension')}`
  );
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

createExtension(projectName, program.verbose, program.scriptsVersion);

function createExtension(name, verbose, version) {
  const root = path.resolve(name);
  const appName = path.basename(root);

  if (fs.pathExistsSync(name)) {
    console.error(chalk.red(`${root} folder already exists.`));
    process.exit(0);
  }
  fs.ensureDirSync(name);

  console.log(`Creating a new Contentful extension in ${chalk.green(root)}.`);
  console.log();

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        name: appName,
        version: '0.1.0',
        private: true,
      },
      null,
      2
    ) + os.EOL
  );

  const originalDirectory = process.cwd();
  run(root, appName, version, verbose, originalDirectory);
}

function install(root, dependencies, verbose) {
  return new Promise((resolve, reject) => {
    const command = 'npm';
    const args = [
      'install',
      '--save',
      '--save-exact',
      '--loglevel',
      'error',
    ].concat(dependencies);

    if (verbose) {
      args.push('--verbose');
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

function run(root, appName, version, verbose) {
  const allDependencies = [
    '@contentful/forma-36-fcss',
    '@contentful/forma-36-tokens',
    '@contentful/forma-36-react-components',
    'react',
    'react-dom',
  ];

  const devDependencies = [
    'lint-staged',
    'husky',
    'prettier',
    '@types/react',
    '@types/react-dom',
  ];

  console.log('Installing packages. This might take a couple of minutes.');

  return install(root, devDependencies, verbose, true).then(() => {
    install(root, allDependencies, verbose, false).then(() => {
      // const init = require(`${root}/node_modules/react-chrome-extension-scripts/scripts/init.js`);
      // init(root, appName, verbose);
    });
  });
}
