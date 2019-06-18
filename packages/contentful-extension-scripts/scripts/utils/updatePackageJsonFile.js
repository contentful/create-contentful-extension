module.exports = (pkg, { version, language }) => {
  pkg.dependencies = pkg.dependencies || {};
  pkg.scripts = {
    start: 'contentful-extension-scripts start',
    build: 'contentful-extension-scripts build',
    deploy: 'npm run build && contentful extension update --force',
    configure: 'contentful space use && contentful space environment use',
    login: 'contentful login',
    logout: 'contentful logout',
    help: 'contentful-extension-scripts help',
  };
  pkg.devDependencies = {
    '@babel/core': '7.3.4',
    '@babel/plugin-proposal-class-properties': '7.3.4',
    '@babel/plugin-transform-runtime': '7.3.4',
    '@babel/preset-env': '7.3.4',
    '@babel/preset-react': '7.0.0',
    '@contentful/contentful-extension-scripts': version,
    cssnano: '4.1.10',
    'contentful-cli': '0.27.0',
  };
  pkg.dependencies = {
    '@contentful/forma-36-fcss': '^0.0.20',
    '@contentful/forma-36-react-components': '^3.11.2',
    '@contentful/forma-36-tokens': '^0.3.0',
    'contentful-ui-extensions-sdk': '3.8.0',
    'prop-types': '^15.7.2',
    react: '^16.8.6',
    'react-dom': '^16.8.6',
  };
  pkg.browserslist = ['last 5 Chrome version', '> 1%', 'not ie <= 11'];

  if (language === 'typescript') {
    pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
      '@types/react': '^16.8.17',
      '@types/react-dom': '^16.8.4',
      '@types/webpack-env': '1.13.9',
      typescript: '3.5.2',
    });
  }

  return pkg;
};
