"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const utils_1 = require("./utils");
const unzip = require('unzip-crx-3');
const downloadChromeExtension = (chromeStoreID, forceDownload, attempts = 5) => {
    const extensionsStore = utils_1.getPath();
    if (!fs.existsSync(extensionsStore)) {
        fs.mkdirSync(extensionsStore, { recursive: true });
    }
    const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`);
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(extensionFolder) || forceDownload) {
            if (fs.existsSync(extensionFolder)) {
                rimraf.sync(extensionFolder);
            }
            const fileURL = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${chromeStoreID}%26uc&prodversion=32`; // eslint-disable-line
            const filePath = path.resolve(`${extensionFolder}.crx`);
            utils_1.downloadFile(fileURL, filePath)
                .then(() => {
                unzip(filePath, extensionFolder)
                    .then(() => {
                    utils_1.changePermissions(extensionFolder, 755);
                    resolve(extensionFolder);
                })
                    .catch((err) => {
                    if (!fs.existsSync(path.resolve(extensionFolder, 'manifest.json'))) {
                        return reject(err);
                    }
                });
            })
                .catch((err) => {
                console.log(`Failed to fetch extension, trying ${attempts - 1} more times`); // eslint-disable-line
                if (attempts <= 1) {
                    return reject(err);
                }
                setTimeout(() => {
                    downloadChromeExtension(chromeStoreID, forceDownload, attempts - 1)
                        .then(resolve)
                        .catch(reject);
                }, 200);
            });
        }
        else {
            resolve(extensionFolder);
        }
    });
};
exports.default = downloadChromeExtension;
//# sourceMappingURL=downloadChromeExtension.js.map