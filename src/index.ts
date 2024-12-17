import { BrowserWindow, LoadExtensionOptions, session } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

import downloadChromeExtension from './downloadChromeExtension';
import { getPath } from './utils';

let IDMap: Record<string, string> = {};
const getIDMapPath = () => path.resolve(getPath(), 'IDMap.json');
if (fs.existsSync(getIDMapPath())) {
  try {
    IDMap = JSON.parse(fs.readFileSync(getIDMapPath(), 'utf8'));
  } catch (err) {
    console.error('electron-devtools-installer: Invalid JSON present in the IDMap file');
  }
}

interface ExtensionReference {
  /**
   * Extension ID
   */
  id: string;
  /**
   * Range of electron versions this extension is supported by
   */
  electron: string;
}

interface ExtensionOptions {
  /**
   * Ignore whether the extension is already downloaded and redownload every time
   */
  forceDownload?: boolean;
  /**
   * Options passed to session.loadExtension
   */
  loadExtensionOptions?: LoadExtensionOptions;
}

/**
 * @param extensionReference Extension or extensions to install
 * @param options Installation options
 * @returns A promise resolving with the name or names of the extensions installed
 */
const install = (
  extensionReference: ExtensionReference | string | Array<ExtensionReference | string>,
  options: ExtensionOptions = {},
): Promise<string> => {
  const { forceDownload, loadExtensionOptions } = options;

  if (process.type !== 'browser') {
    return Promise.reject(
      new Error('electron-devtools-installer can only be used from the main process'),
    );
  }

  if (Array.isArray(extensionReference)) {
    return extensionReference.reduce(
      (accum, extension) => accum.then(() => install(extension, options)),
      Promise.resolve(''),
    );
  }
  let chromeStoreID: string;
  if (typeof extensionReference === 'object' && extensionReference.id) {
    chromeStoreID = extensionReference.id;
    const electronVersion = process.versions.electron.split('-')[0];
    if (!semver.satisfies(electronVersion, extensionReference.electron)) {
      return Promise.reject(
        new Error(
          `Version of Electron: ${electronVersion} does not match required range ${extensionReference.electron} for extension ${chromeStoreID}`,
        ), // eslint-disable-line
      );
    }
  } else if (typeof extensionReference === 'string') {
    chromeStoreID = extensionReference;
  } else {
    return Promise.reject(
      new Error(`Invalid extensionReference passed in: "${extensionReference}"`),
    );
  }
  const extensionName = IDMap[chromeStoreID];

  const extensionInstalled =
    !!extensionName &&
    session.defaultSession.getAllExtensions().find((e) => e.name === extensionName);

  if (!forceDownload && extensionInstalled) {
    return Promise.resolve(IDMap[chromeStoreID]);
  }
  return downloadChromeExtension(chromeStoreID, forceDownload || false).then((extensionFolder) => {
    // Use forceDownload, but already installed
    if (extensionInstalled) {
      const extensionId = session.defaultSession.getAllExtensions().find((e) => e.name)?.id;
      if (extensionId) {
        session.defaultSession.removeExtension(extensionId);
      }
    }

    return session.defaultSession
      .loadExtension(extensionFolder, loadExtensionOptions)
      .then((ext: { name: string }) => {
        return Promise.resolve(ext.name);
      });
  });
};

export default install;
export const EMBER_INSPECTOR: ExtensionReference = {
  id: 'bmdblncegkenkacieihfhpjfppoconhi',
  electron: '>=1.2.1',
};
export const REACT_DEVELOPER_TOOLS: ExtensionReference = {
  id: 'fmkadmapgofadopljbjfkapdkoienihi',
  electron: '>=1.2.1',
};
export const BACKBONE_DEBUGGER: ExtensionReference = {
  id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd',
  electron: '>=1.2.1',
};
export const JQUERY_DEBUGGER: ExtensionReference = {
  id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi',
  electron: '>=1.2.1',
};
export const VUEJS_DEVTOOLS: ExtensionReference = {
  id: 'nhdogjmejiglipccpnnnanhbledajbpd',
  electron: '>=1.2.1',
};
export const VUEJS3_DEVTOOLS: ExtensionReference = {
  id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
  electron: '>=1.2.1',
};
export const REDUX_DEVTOOLS: ExtensionReference = {
  id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',
  electron: '>=1.2.1',
};
export const MOBX_DEVTOOLS: ExtensionReference = {
  id: 'pfgnfdagidkfgccljigdamigbcnndkod',
  electron: '>=1.2.1',
};
