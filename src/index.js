import electron, { remote } from 'electron';

import downloadChromeExtension from './downloadChromeExtension';

export default (chromeStoreID, forceDownload = false) =>
  downloadChromeExtension(chromeStoreID, forceDownload)
    .then((extensionFolder) =>
      Promise.resolve((remote || electron).BrowserWindow.addDevToolsExtension(extensionFolder))
    );

export const EMBER_INSPECTOR = 'bmdblncegkenkacieihfhpjfppoconhi';
export const REACT_DEVELOPER_TOOLS = 'fmkadmapgofadopljbjfkapdkoienihi';
export const BACKBONE_DEBUGGER = 'bhljhndlimiafopmmhjlgfpnnchjjbhd';
export const JQUERY_DEBUGGER = 'dbhhnnnpaeobfddmlalhnehgclcmjimi';
export const ANGULARJS_BATARANG = 'ighdmehidhipcmcojjgiloacoafjmpfk';
export const VUEJS_DEVTOOLS = 'nhdogjmejiglipccpnnnanhbledajbpd';
