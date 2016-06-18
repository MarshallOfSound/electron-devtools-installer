import electron, { remote } from 'electron';
import fs from 'fs';
import { https } from 'follow-redirects';
import path from 'path';
import request from 'request';
import rimraf from 'rimraf';
import unzip from 'cross-unzip';

const downloadChromeExtension = (chromeStoreID, forceDownload) => {
  const savePath = (remote || electron).app.getPath('userData');
  const extensionsStore = path.resolve(`${savePath}/extensions`);
  if (!fs.existsSync(extensionsStore)) {
    fs.mkdirSync(extensionsStore);
  }
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
      })
      .pipe(download)
      .on('error', (err) => reject(err))
      .on('close', () => {
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
