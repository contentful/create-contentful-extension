module.exports = (pkg, version) => {
  pkg.dependencies = pkg.dependencies || {};
  pkg.scripts = {
    prestart:
      'contentful space use && contentful extension update --src http://localhost:1234 --force',
    start: 'contentful-extension-scripts start',
    build: 'contentful-extension-scripts build',
    deploy:
      'npm run build && contentful space use && contentful extension update --force',
    login: 'contentful login',
    logout: 'contentful logout',
    help: 'contentful-extension-scripts help',
  };
  pkg.devDependencies = {
    '@babel/core': '^7.3.4',
    '@babel/plugin-proposal-class-properties': '^7.3.4',
    '@babel/plugin-transform-runtime': '^7.3.4',
    '@babel/preset-env': '^7.3.4',
    '@babel/preset-react': '^7.0.0',
    '@contentful/contentful-extension-scripts': version,
    'contentful-cli': '0.24.0',
  };
  pkg.dependencies = {
    '@contentful/forma-36-fcss': '^0.0.15',
    '@contentful/forma-36-react-components': '^2.10.1',
    '@contentful/forma-36-tokens': '^0.2.2',
    'contentful-ui-extensions-sdk': '3.7.0',
    'prop-types': '^15.7.2',
    react: '^16.8.4',
    'react-dom': '^16.8.4',
  };
  pkg.browserslist = ['last 5 Chrome version', '> 1%', 'not ie <= 11'];
  return pkg;
};
