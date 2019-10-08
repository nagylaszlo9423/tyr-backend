const _path = require('path');

module.exports = function (path) {
  return _path.resolve(__dirname, '../', path);
};
