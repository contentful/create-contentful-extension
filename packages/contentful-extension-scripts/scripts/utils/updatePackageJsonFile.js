module.exports = pkg => {
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
  pkg.browserslist = ['last 5 Chrome version', '> 1%', 'not ie <= 11'];
  return pkg;
};
