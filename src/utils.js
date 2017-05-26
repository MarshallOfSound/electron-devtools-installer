import electron, { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import https from 'https';

export const getPath = () => {
  const savePath = (remote || electron).app.getPath('userData');
  return path.resolve(`${savePath}/extensions`);
};

// Use https.get fallback for Electron < 1.4.5
const { net } = remote || electron;
const request = net ? net.request : https.get;

const sendRequest = url => new Promise((resolve, reject) => {
  const req = request(url);
  req.on('response', (res) => {
    // Shouldn't handle redirect with `electron.net`, this is for https.get fallback
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return sendRequest(res.headers.location);
    }
    resolve(res);
  });
  req.on('error', reject);
  req.end();
});

export const downloadFile = (from, to) => new Promise((resolve, reject) =>
  sendRequest(from)
    .then(res => res.pipe(fs.createWriteStream(to)).on('close', resolve))
    .catch(reject),
);

export const fetchData = url => new Promise((resolve, reject) =>
  sendRequest(url)
    .then((res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(Object.assign({}, res, { body })));
    })
    .catch(reject),
);
