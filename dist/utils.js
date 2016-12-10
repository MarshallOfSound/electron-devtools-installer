'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCustomPath = exports.getPath = undefined;

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var customPath = null;

var getPath = exports.getPath = function getPath() {
  if (customPath) return customPath;
  var savePath = (_electron.remote || _electron2.default).app.getPath('userData');
  var extensionsStore = _path2.default.resolve(savePath + '/extensions');
  if (!_fs2.default.existsSync(extensionsStore)) {
    _fs2.default.mkdirSync(extensionsStore);
  }
  return extensionsStore;
};

var setCustomPath = exports.setCustomPath = function setCustomPath(p) {
  customPath = p;
};