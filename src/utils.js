import electron, { remote } from 'electron';
import fs from 'fs';
import path from 'path';

let customPath = null;

export const getPath = () => {
  if (customPath) return customPath;
  const savePath = (remote || electron).app.getPath('userData');
  const extensionsStore = path.resolve(`${savePath}/extensions`);
  if (!fs.existsSync(extensionsStore)) {
    fs.mkdirSync(extensionsStore);
  }
  return extensionsStore;
};

export const setCustomPath = (p) => {
  customPath = p;
};
