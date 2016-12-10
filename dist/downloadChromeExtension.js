'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _crossUnzip = require('cross-unzip');

var _crossUnzip2 = _interopRequireDefault(_crossUnzip);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var downloadChromeExtension = function downloadChromeExtension(chromeStoreID, forceDownload) {
  var attempts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

  var extensionsStore = (0, _utils.getPath)();
  var extensionFolder = _path2.default.resolve(extensionsStore + '/' + chromeStoreID);
  return new Promise(function (resolve, reject) {
    if (!_fs2.default.existsSync(extensionFolder) || forceDownload) {
      if (_fs2.default.existsSync(extensionFolder)) {
        _rimraf2.default.sync(extensionFolder);
      }
      var fileURL = 'https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D' + chromeStoreID + '%26uc&prodversion=32'; // eslint-disable-line
      var download = _fs2.default.createWriteStream(_path2.default.resolve(extensionFolder + '.crx'));
      (0, _request2.default)({
        url: fileURL,
        followAllRedirects: true,
        timeout: 10000,
        gzip: true
      }).on('error', function (err) {
        console.log('Failed to fetch extension, trying ' + (attempts - 1) + ' more times'); // eslint-disable-line
        if (attempts <= 1) {
          return reject(err);
        }
        setTimeout(function () {
          downloadChromeExtension(chromeStoreID, forceDownload, attempts - 1).then(resolve).catch(reject);
        }, 200);
      }).pipe(download).on('close', function () {
        (0, _crossUnzip2.default)(_path2.default.resolve(extensionFolder + '.crx'), extensionFolder, function (err) {
          if (err && !_fs2.default.existsSync(_path2.default.resolve(extensionFolder, 'manifest.json'))) {
            return reject(err);
          }
          resolve(extensionFolder);
        });
      });
    } else {
      resolve(extensionFolder);
    }
  });
};

exports.default = downloadChromeExtension;