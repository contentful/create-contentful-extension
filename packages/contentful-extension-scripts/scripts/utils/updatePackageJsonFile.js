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
    help: 'contentful-extension-scripts help',
  };
  pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
    '@babel/core': '7.12.3',
    '@babel/plugin-transform-runtime': '7.12.1',
    '@babel/preset-env': '7.12.1',
    '@babel/preset-react': '7.12.1',
    '@testing-library/react': '11.1.1',
    cssnano: '4.1.10',
    'contentful-cli': '1.4.48',
    eslint: '7.12.1',
  });
  pkg.dependencies = {
    '@contentful/forma-36-fcss': '0.2.12',
    '@contentful/forma-36-react-components': '3.64.2',
    '@contentful/forma-36-tokens': '0.9.2',
    'contentful-ui-extensions-sdk': '3.24.0',
    'prop-types': '15.7.2',
    react: '17.0.1',
    'react-dom': '17.0.1',
  };

  pkg.browserslist = ['last 5 Chrome version', '> 1%', 'not ie <= 11'];

  if (type === 'page') {
    pkg.dependencies = Object.assign({}, pkg.dependencies, {
      history: '5.0.0',
      'react-router': '5.2.0',
      'react-router-dom': '5.2.0',
    });
    if (language === 'typescript') {
      pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
        '@types/history': '4.7.8',
        '@types/react-router': '5.1.8',
        '@types/react-router-dom': '5.1.6',
      });
    }
  }

  if (language === 'typescript') {
    pkg.scripts = Object.assign({}, pkg.scripts, {
      lint: 'eslint ./ --ext .js,.jsx,.ts,.tsx && tsc -p ./ --noEmit',
    });

    pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
      typescript: '4.0.5',
      '@types/jest': '26.0.15',
      '@types/react': '16.9.56',
      '@types/react-dom': '16.9.9',
      '@types/webpack-env': '1.15.3',
    });
  }

  return pkg;
};
