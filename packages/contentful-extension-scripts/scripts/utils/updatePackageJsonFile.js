module.exports = pkg => {
  pkg.dependencies = pkg.dependencies || {};
  pkg.scripts = {
    start: 'contentful-extension-scripts start',
    build: 'contentful-extension-scripts build',
    'dev:publish':
      'contentful space use && contentful extension update --src http://localhost:1234 --force',
    publish:
      'npm run build && contentful space use && contentful extension update --force',
  };
  pkg.browserslist = ['last 5 Chrome version', '> 1%', 'not ie <= 11'];
  return pkg;
};
