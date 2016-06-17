import { remote } from 'electron';

import downloadChromeExtension from './downloadChromeExtension';

module.exports = (chromeStoreID, forceDownload = false) =>
  downloadChromeExtension(chromeStoreID, forceDownload)
    .then((extensionFolder) =>
      Promise.resolve(remote.BrowserWindow.addDevToolsExtension(extensionFolder))
    );
