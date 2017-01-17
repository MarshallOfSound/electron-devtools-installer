import electron, { remote } from 'electron';
import path from 'path';

let customPath = null;

export const getPath = () => {
  if (customPath) return customPath;
  const savePath = (remote || electron).app.getPath('userData');
  return path.resolve(`${savePath}/extensions`);
};

export const setCustomPath = (p) => {
  customPath = p;
};
