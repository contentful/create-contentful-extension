module.exports = (appName, type, fields) => {
  const result = {
    id: appName,
    name: appName,
    srcdoc: './build/index.html'
  };
  if (type === 'sidebar' || type === 'page') {
    result.sidebar = true;
  } else if (type === 'fields') {
    result.fieldTypes = fields || [];
  }
  return result;
};
