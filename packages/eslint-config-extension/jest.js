module.exports = {
  extends: ['plugin:jest/recommended', 'plugin:jest/style'],
  rules: {
    'jest/no-large-snapshots': ['warn', { maxSize: 300 }]
  }
};
