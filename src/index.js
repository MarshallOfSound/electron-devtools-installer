import electron, { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import semver from 'semver';

import downloadChromeExtension from './downloadChromeExtension';
import { getPath } from './utils';

const { BrowserWindow } = remote || electron;

let IDMap = {};
const IDMapPath = path.resolve(getPath(), 'IDMap.json');
if (fs.existsSync(IDMapPath)) {
  try {
    IDMap = JSON.parse(fs.readFileSync(IDMapPath, 'utf8'));
  } catch (err) {
    console.error('electron-devtools-installer: Invalid JSON present in the IDMap file');
  }
}

const install = (extensionReference, forceDownload = false) => {
  if (Array.isArray(extensionReference)) {
    return Promise.all(extensionReference.map(extension => install(extension, forceDownload)));
  }
  let chromeStoreID;
  if (typeof extensionReference === 'object' && extensionReference.id) {
    chromeStoreID = extensionReference.id;
  } else if (typeof extensionReference === 'string') {
    chromeStoreID = extensionReference;
  } else {
    return Promise.reject(new Error(`Invalid extensionReference passed in: "${extensionReference}"`));
  }
  const extensionName = IDMap[chromeStoreID];
  const extensionInstalled = extensionName &&
    BrowserWindow.getDevToolsExtensions &&
    BrowserWindow.getDevToolsExtensions()[extensionName];
  if (!forceDownload && extensionInstalled) {
    return Promise.resolve(IDMap[chromeStoreID]);
  }
  return downloadChromeExtension(chromeStoreID, forceDownload)
    .then((extensionFolder) => {
      // Use forceDownload, but already installed
      if (extensionInstalled) {
        BrowserWindow.removeDevToolsExtension(extensionName);
      }
      const name = BrowserWindow.addDevToolsExtension(extensionFolder); // eslint-disable-line
      fs.writeFileSync(
        IDMapPath,
        JSON.stringify(Object.assign(IDMap, {
          [chromeStoreID]: name,
        })),
      );
      return Promise.resolve(name);
    });
};

export default install;
export const EMBER_INSPECTOR = {
  id: 'bmdblncegkenkacieihfhpjfppoconhi',
};
export const REACT_DEVELOPER_TOOLS = {
  id: 'fmkadmapgofadopljbjfkapdkoienihi',
};
export const BACKBONE_DEBUGGER = {
  id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd',
};
export const JQUERY_DEBUGGER = {
  id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi',
};
export const ANGULARJS_BATARANG = {
  id: 'ighdmehidhipcmcojjgiloacoafjmpfk',
};
export const VUEJS_DEVTOOLS = {
  id: 'nhdogjmejiglipccpnnnanhbledajbpd',
};
export const REDUX_DEVTOOLS = {
  id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',
};
export const REACT_PERF = {
  id: 'hacmcodfllhbnekmghgdlplbdnahmhmm',
};
export const CYCLEJS_DEVTOOL = {
  id: 'dfgplfmhhmdekalbpejekgfegkonjpfp',
};
export const APOLLO_DEVELOPER_TOOLS = {
  id: 'jdkknkkbebbapilgoeccciglkfbmbnfm',
};
export const MOBX_DEVTOOLS = {
  id: 'pfgnfdagidkfgccljigdamigbcnndkod',
};
