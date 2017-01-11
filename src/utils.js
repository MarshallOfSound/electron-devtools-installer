import electron, { remote } from 'electron';
import path from 'path';

export const getPath = () => {
  const savePath = (remote || electron).app.getPath('userData');
  return path.resolve(`${savePath}/extensions`);
};
