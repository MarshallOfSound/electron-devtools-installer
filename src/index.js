import electron, { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import semver from 'semver';

import downloadChromeExtension from './downloadChromeExtension';
import { getPath } from './utils';

let IDMap = {};
const IDMapPath = path.resolve(getPath(), 'IDMap.json');
if (fs.existsSync(IDMapPath)) {
  IDMap = JSON.parse(fs.readFileSync(IDMapPath, 'utf8'));
}

export default (extensionReference, forceDownload = false) => {
  let chromeStoreID;
  if (typeof extensionReference === 'object' && extensionReference.id) {
    chromeStoreID = extensionReference.id;
    if (!semver.satisfies(process.versions.electron, extensionReference.electron)) {
      return Promise.reject(
        new Error(`Version of Electron: ${process.versions.electron} does not match required range ${extensionReference.electron} for extension ${chromeStoreID}`)
      );
    }
  } else if (typeof extensionReference === 'string') {
    chromeStoreID = extensionReference;
  } else {
    return Promise.reject(new Error(`Invalid extensionReference passed in: "${extensionReference}"`));
  }
  if (
    !forceDownload &&
    IDMap[chromeStoreID] &&
    (remote || electron).BrowserWindow.getDevToolsExtensions &&
    (remote || electron).BrowserWindow.getDevToolsExtensions()[IDMap[chromeStoreID]]
  ) {
    return Promise.resolve(IDMap[chromeStoreID]);
  }
  return downloadChromeExtension(chromeStoreID, forceDownload)
    .then((extensionFolder) => {
      const name = (remote || electron).BrowserWindow.addDevToolsExtension(extensionFolder); // eslint-disable-line
      IDMap = Object.assign(IDMap, {
        [chromeStoreID]: name,
      });
      fs.writeFileSync(IDMapPath, JSON.stringify(IDMap));
      return Promise.resolve(name);
    });
};

export const EMBER_INSPECTOR = {
  id: 'bmdblncegkenkacieihfhpjfppoconhi',
  electron: '^1.2.1',
};
export const REACT_DEVELOPER_TOOLS = {
  id: 'fmkadmapgofadopljbjfkapdkoienihi',
  electron: '^1.2.1',
};
export const BACKBONE_DEBUGGER = {
  id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd',
  electron: '^1.2.1',
};
export const JQUERY_DEBUGGER = {
  id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi',
  electron: '^1.2.1',
};
export const ANGULARJS_BATARANG = {
  id: 'ighdmehidhipcmcojjgiloacoafjmpfk',
  electron: '^1.2.1',
};
export const VUEJS_DEVTOOLS = {
  id: 'nhdogjmejiglipccpnnnanhbledajbpd',
  electron: '^1.2.1',
};
export const REDUX_DEVTOOLS = {
  id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',
  electron: '^1.2.1',
};
export const REACT_PERF = {
  id: 'hacmcodfllhbnekmghgdlplbdnahmhmm',
  electron: '^1.2.6',
};
