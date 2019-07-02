module.exports = (pkg, { language, type }) => {
  pkg.scripts = {
    start: 'contentful-extension-scripts start',
    build: 'contentful-extension-scripts build',
    lint: 'eslint ./ --ext .js,.jsx,.ts,.tsx',
    test: 'contentful-extension-scripts test --env=jsdom --watch',
    'test:coverage': 'contentful-extension-scripts test --env=jsdom --coverage',
    deploy: 'npm run build && contentful extension update --force',
    configure: 'contentful space use && contentful space environment use',
    login: 'contentful login',
    logout: 'contentful logout',
    help: 'contentful-extension-scripts help'
  };
  pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
    '@babel/core': '7.3.4',
    '@babel/plugin-proposal-class-properties': '7.3.4',
    '@babel/plugin-transform-runtime': '7.3.4',
    '@babel/preset-env': '7.3.4',
    '@babel/preset-react': '7.0.0',
    '@testing-library/react': '8.0.4',
    cssnano: '4.1.10',
    'contentful-cli': '0.33.2',
    eslint: '^6.0.1'
  });
  pkg.dependencies = {
    '@contentful/forma-36-fcss': '^0.0.20',
    '@contentful/forma-36-react-components': '^3.11.3',
    '@contentful/forma-36-tokens': '^0.3.0',
    'contentful-ui-extensions-sdk': '3.9.0',
    'prop-types': '^15.7.2',
    react: '^16.8.6',
    'react-dom': '^16.8.6'
  };

  pkg.browserslist = ['last 5 Chrome version', '> 1%', 'not ie <= 11'];

  if (type === 'page') {
    pkg.dependencies = Object.assign({}, pkg.dependencies, {
      history: '4.9.0',
      'react-router': '5.0.1',
      'react-router-dom': '5.0.1'
    });
    if (language === 'typescript') {
      pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
        '@types/history': '4.7.2',
        '@types/react-router': '5.0.2',
        '@types/react-router-dom': '4.3.4'
      });
    }
  }

  if (language === 'typescript') {
    pkg.scripts = Object.assign({}, pkg.scripts, {
      lint: 'eslint ./ --ext .js,.jsx,.ts,.tsx && tsc -p ./ --noEmit'
    });

    pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
      typescript: '3.5.2',
      '@types/jest': '24.0.15',
      '@types/react': '^16.8.17',
      '@types/react-dom': '^16.8.4',
      '@types/webpack-env': '1.13.9'
    });
  }

  return pkg;
};
