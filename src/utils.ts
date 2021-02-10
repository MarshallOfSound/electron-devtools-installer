import { app, net } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

export const getPath = () => {
  const savePath = app.getPath('userData');
  return path.resolve(`${savePath}/extensions`);
};

// Use https.get fallback for Electron < 1.4.5
const request: typeof https.request = net ? (net.request as any) : https.get;

export const downloadFile = (from: string, to: string) => {
  return new Promise<void>((resolve, reject) => {
    const req = request(from);
    req.on('response', (res) => {
      // Shouldn't handle redirect with `electron.net`, this is for https.get fallback
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, to).then(resolve).catch(reject);
      }
      res.pipe(fs.createWriteStream(to)).on('close', resolve);
      res.on('error', reject);
    });
    req.on('error', reject);
    req.end();
  });
};

export const changePermissions = (dir: string, mode: string | number) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    fs.chmodSync(filePath, parseInt(`${mode}`, 8));
    if (fs.statSync(filePath).isDirectory()) {
      changePermissions(filePath, mode);
    }
  });
};
