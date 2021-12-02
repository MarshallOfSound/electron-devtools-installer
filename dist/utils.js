"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePermissions = exports.downloadFile = exports.getPath = void 0;
const electron_1 = require("electron");
const fs = require("fs");
const path = require("path");
const https = require("https");
const getPath = () => {
    const savePath = electron_1.app.getPath('userData');
    return path.resolve(`${savePath}/extensions`);
};
exports.getPath = getPath;
// Use https.get fallback for Electron < 1.4.5
const request = electron_1.net ? electron_1.net.request : https.get;
const downloadFile = (from, to) => {
    return new Promise((resolve, reject) => {
        const req = request(from);
        req.on('response', (res) => {
            // Shouldn't handle redirect with `electron.net`, this is for https.get fallback
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return exports.downloadFile(res.headers.location, to).then(resolve).catch(reject);
            }
            res.pipe(fs.createWriteStream(to)).on('close', resolve);
            res.on('error', reject);
        });
        req.on('error', reject);
        req.end();
    });
};
exports.downloadFile = downloadFile;
const changePermissions = (dir, mode) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        fs.chmodSync(filePath, parseInt(`${mode}`, 8));
        if (fs.statSync(filePath).isDirectory()) {
            exports.changePermissions(filePath, mode);
        }
    });
};
exports.changePermissions = changePermissions;
//# sourceMappingURL=utils.js.map