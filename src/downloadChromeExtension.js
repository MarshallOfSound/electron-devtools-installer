import fs from 'fs';
import path from 'path';
import request from 'request';
import rimraf from 'rimraf';
import unzip from 'cross-unzip';

import { getPath } from './utils';

const downloadChromeExtension = (chromeStoreID, forceDownload, attempts = 5) => {
  const extensionsStore = getPath();
  const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`);
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(extensionFolder) || forceDownload) {
      if (fs.existsSync(extensionFolder)) {
        rimraf.sync(extensionFolder);
      }
      const fileURL = `https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D${chromeStoreID}%26uc&prodversion=32`; // eslint-disable-line
      const download = fs.createWriteStream(path.resolve(`${extensionFolder}.crx`));
      request({
        url: fileURL,
        followAllRedirects: true,
        timeout: 10000,
        gzip: true,
      }).on('error', (err) => {
        console.log(`Failed to fetch extension, trying ${attempts - 1} more times`); // eslint-disable-line
        if (attempts <= 1) {
          return reject(err);
        }
        setTimeout(() => {
          downloadChromeExtension(chromeStoreID, forceDownload, attempts - 1)
            .then(resolve)
            .catch(reject);
        }, 200);
      }).pipe(download).on('close', () => {
        unzip(path.resolve(`${extensionFolder}.crx`), extensionFolder, (err) => {
          if (err && !fs.existsSync(path.resolve(extensionFolder, 'manifest.json'))) {
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


export default downloadChromeExtension;
