const _path = require('path');

module.exports = function (path) {
  console.log(_path.resolve(__dirname, '../', path));
  return _path.resolve(__dirname, '../', path);
};
