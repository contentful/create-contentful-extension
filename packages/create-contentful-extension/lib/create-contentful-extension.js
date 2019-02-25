/* eslint-disable no-console, no-process-exit */

const chalk = require('chalk');
const inquirer = require('inquirer');
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

function install(root, dependencies, verbose, isDev) {
  return new Promise((resolve, reject) => {
    let command;
    let args;
    command = 'npm';
    args = [
      'install',
      '--prefix',
      root,
      isDev ? '--save-dev' : '--save',
      '--save-exact',
      '--no-package-lock',
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

function run(root, payload, verbose, originalDirectory) {
  const allDependencies = [
    '@contentful/forma-36-react-components',
    '@contentful/forma-36-tokens',
    '@contentful/forma-36-fcss',
    'contentful-ui-extensions-sdk',
    'react',
    'react-dom',
    'prop-types',
  ];

  const devDependencies = [
    'contentful-cli',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    // path.resolve('./packages/contentful-extension-scripts'),
    'contentful-extension-scripts',
  ];

  return install(root, devDependencies, verbose, true).then(() => {
    install(root, allDependencies, verbose, false).then(() => {
      const init = require(`${root}/node_modules/contentful-extension-scripts/scripts/init.js`);
      init(root, payload, originalDirectory);
    });
  });
}

const createExtension = async (name, verbose) => {
  const root = path.resolve(name);
  const appName = path.basename(root);

  if (fs.pathExistsSync(name)) {
    console.error(chalk.red(`${root} folder already exists.`));
    process.exit(0);
  }
  fs.ensureDirSync(name);

  console.log(`Creating a new Contentful extension in ${chalk.green(root)}.`);
  console.log();

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Select type of extension:',
      choices: [
        { name: 'field extension', value: 'fields' },
        { name: 'sidebar extension', value: 'sidebar' },
      ],
    },
    {
      type: 'checkbox',
      name: 'fields',
      message: 'Select field types for this extension:',
      choices: [
        { name: 'Symbol' },
        { name: 'Symbols' },
        { name: 'Text' },
        { name: 'Integer' },
        { name: 'Number' },
        { name: 'Date' },
        { name: 'Boolean' },
        { name: 'Entry' },
        { name: 'Entries' },
        { name: 'Asset' },
        { name: 'Assets' },
      ],
      when: function(answers) {
        return answers.type === 'fields';
      },
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one field type.';
        }
        return true;
      },
    },
  ]);

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
  run(
    root,
    {
      name: appName,
      type: answers.type,
      fields: answers.fields || [],
    },
    verbose,
    originalDirectory
  );
};

createExtension(projectName, program.verbose);
