import electron, { remote } from 'electron';
import fs from 'fs';
import path from 'path';

import downloadChromeExtension from './downloadChromeExtension';
import { getPath } from './utils';

let IDMap = {};
const IDMapPath = path.resolve(getPath(), 'IDMap.json');
if (fs.existsSync(IDMapPath)) {
  IDMap = JSON.parse(fs.readFileSync(IDMapPath, 'utf8'));
}

export default (chromeStoreID, forceDownload = false) => {
  if (
    IDMap[chromeStoreID] &&
    (remote || electron).BrowserWindow.getDevToolsExtensions &&
    (remote || electron).BrowserWindow.getDevToolsExtensions().hasOwnProperty(IDMap[chromeStoreID])
  ) {
    return Promise.reject(`${IDMap[chromeStoreID]} is already installed`);
  }
  return downloadChromeExtension(chromeStoreID, forceDownload)
    .then((extensionFolder) => {
      const name = (remote || electron).BrowserWindow.addDevToolsExtension(extensionFolder); // eslint-disable-line
      fs.writeFileSync(
        IDMapPath,
        JSON.stringify(Object.assign(IDMap, {
          [chromeStoreID]: name,
        }))
      );
      return Promise.resolve(name);
    });
};

export const EMBER_INSPECTOR = 'bmdblncegkenkacieihfhpjfppoconhi';
export const REACT_DEVELOPER_TOOLS = 'fmkadmapgofadopljbjfkapdkoienihi';
export const BACKBONE_DEBUGGER = 'bhljhndlimiafopmmhjlgfpnnchjjbhd';
export const JQUERY_DEBUGGER = 'dbhhnnnpaeobfddmlalhnehgclcmjimi';
export const ANGULARJS_BATARANG = 'ighdmehidhipcmcojjgiloacoafjmpfk';
export const VUEJS_DEVTOOLS = 'nhdogjmejiglipccpnnnanhbledajbpd';
export const REDUX_DEVTOOLS = 'lmhkpmbekcpmknklioeibfkpmmfibljd';
