import { Extension, LoadExtensionOptions, Session, session } from 'electron';

import { downloadChromeExtension } from './downloadChromeExtension';

export interface ExtensionReference {
  /**
   * Extension ID
   */
  id: string;
}

export interface InstallExtensionOptions {
  /**
   * Ignore whether the extension is already downloaded and redownload every time
   */
  forceDownload?: boolean;
  /**
   * Options passed to session.loadExtension
   */
  loadExtensionOptions?: LoadExtensionOptions;
  /**
   * Optionally specify the session to install devtools into, by default devtools
   * will be installed into the "defaultSession". See the Electron Session docs
   * for more info.
   *
   * https://electronjs.org/docs/api/session
   */
  session?: Session;
}

/**
 * @param extensionReference Extension or extensions to install
 * @param options Installation options
 * @returns A promise resolving with the name or names of the extensions installed
 */
export async function installExtension(
  extensionReference: Array<ExtensionReference | string>,
  options?: InstallExtensionOptions,
): Promise<Extension[]>;
export async function installExtension(
  extensionReference: ExtensionReference | string,
  options?: InstallExtensionOptions,
): Promise<Extension>;
export async function installExtension(
  extensionReference: ExtensionReference | string | Array<ExtensionReference | string>,
  options: InstallExtensionOptions = {},
): Promise<Extension | Extension[]> {
  const { forceDownload, loadExtensionOptions, session: _session } = options;
  const targetSession = _session || session.defaultSession;

  if (process.type !== 'browser') {
    return Promise.reject(
      new Error('electron-devtools-installer can only be used from the main process'),
    );
  }

  if (Array.isArray(extensionReference)) {
    return extensionReference.reduce(
      (accum, extension) =>
        accum.then(async (result) => {
          const inner = await installExtension(extension, options);
          return [...result, inner];
        }),
      Promise.resolve([] as Extension[]),
    );
  }
  let chromeStoreID: string;
  if (typeof extensionReference === 'object' && extensionReference.id) {
    chromeStoreID = extensionReference.id;
  } else if (typeof extensionReference === 'string') {
    chromeStoreID = extensionReference;
  } else {
    throw new Error(`Invalid extensionReference passed in: "${extensionReference}"`);
  }

  const installedExtension = targetSession.getAllExtensions().find((e) => e.id === chromeStoreID);

  if (!forceDownload && installedExtension) {
    return installedExtension;
  }
  const extensionFolder = await downloadChromeExtension(chromeStoreID, {
    forceDownload: forceDownload || false,
  });
  // Use forceDownload, but already installed
  if (installedExtension?.id) {
    const unloadPromise = new Promise<void>((resolve) => {
      const handler = (_: unknown, ext: Extension) => {
        if (ext.id === installedExtension.id) {
          targetSession.removeListener('extension-unloaded', handler);
          resolve();
        }
      };
      targetSession.on('extension-unloaded', handler);
    });
    targetSession.removeExtension(installedExtension.id);
    await unloadPromise;
  }

  return targetSession.loadExtension(extensionFolder, loadExtensionOptions);
}

export default installExtension;
export const EMBER_INSPECTOR: ExtensionReference = {
  id: 'bmdblncegkenkacieihfhpjfppoconhi',
};
export const REACT_DEVELOPER_TOOLS: ExtensionReference = {
  id: 'fmkadmapgofadopljbjfkapdkoienihi',
};
export const BACKBONE_DEBUGGER: ExtensionReference = {
  id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd',
};
export const JQUERY_DEBUGGER: ExtensionReference = {
  id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi',
};
export const VUEJS_DEVTOOLS: ExtensionReference = {
  id: 'nhdogjmejiglipccpnnnanhbledajbpd',
};
export const VUEJS_DEVTOOLS_BETA: ExtensionReference = {
  id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
};
export const REDUX_DEVTOOLS: ExtensionReference = {
  id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',
};
export const MOBX_DEVTOOLS: ExtensionReference = {
  id: 'pfgnfdagidkfgccljigdamigbcnndkod',
};
