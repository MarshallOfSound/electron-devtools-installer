"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOBX_DEVTOOLS = exports.APOLLO_DEVELOPER_TOOLS = exports.CYCLEJS_DEVTOOL = exports.REDUX_DEVTOOLS = exports.VUEJS3_DEVTOOLS = exports.VUEJS_DEVTOOLS = exports.ANGULARJS_BATARANG = exports.JQUERY_DEBUGGER = exports.BACKBONE_DEBUGGER = exports.REACT_DEVELOPER_TOOLS = exports.EMBER_INSPECTOR = void 0;
const electron_1 = require("electron");
const fs = require("fs");
const path = require("path");
const semver = require("semver");
const downloadChromeExtension_1 = require("./downloadChromeExtension");
const utils_1 = require("./utils");
let IDMap = {};
const getIDMapPath = () => path.resolve(utils_1.getPath(), 'IDMap.json');
if (fs.existsSync(getIDMapPath())) {
    try {
        IDMap = JSON.parse(fs.readFileSync(getIDMapPath(), 'utf8'));
    }
    catch (err) {
        console.error('electron-devtools-installer: Invalid JSON present in the IDMap file');
    }
}
/**
 * @param extensionReference Extension or extensions to install
 * @param options Installation options
 * @returns A promise resolving with the name or names of the extensions installed
 */
const install = (extensionReference, options = {}) => {
    // Support old forceDownload syntax
    if (typeof options === 'boolean') {
        options = { forceDownload: options };
    }
    const { forceDownload, loadExtensionOptions } = options;
    if (process.type !== 'browser') {
        return Promise.reject(new Error('electron-devtools-installer can only be used from the main process'));
    }
    if (Array.isArray(extensionReference)) {
        return extensionReference.reduce((accum, extension) => accum.then(() => install(extension, options)), Promise.resolve(''));
    }
    let chromeStoreID;
    if (typeof extensionReference === 'object' && extensionReference.id) {
        chromeStoreID = extensionReference.id;
        const electronVersion = process.versions.electron.split('-')[0];
        if (!semver.satisfies(electronVersion, extensionReference.electron)) {
            return Promise.reject(new Error(`Version of Electron: ${electronVersion} does not match required range ${extensionReference.electron} for extension ${chromeStoreID}`));
        }
    }
    else if (typeof extensionReference === 'string') {
        chromeStoreID = extensionReference;
    }
    else {
        return Promise.reject(new Error(`Invalid extensionReference passed in: "${extensionReference}"`));
    }
    const extensionName = IDMap[chromeStoreID];
    let extensionInstalled;
    // For Electron >=9.
    if (electron_1.session.defaultSession.getExtension) {
        extensionInstalled =
            !!extensionName &&
                electron_1.session.defaultSession
                    .getAllExtensions()
                    .find((e) => e.name === extensionName);
    }
    else {
        extensionInstalled =
            !!extensionName &&
                electron_1.BrowserWindow.getDevToolsExtensions &&
                electron_1.BrowserWindow.getDevToolsExtensions().hasOwnProperty(extensionName);
    }
    if (!forceDownload && extensionInstalled) {
        return Promise.resolve(IDMap[chromeStoreID]);
    }
    return downloadChromeExtension_1.default(chromeStoreID, forceDownload || false).then((extensionFolder) => {
        // Use forceDownload, but already installed
        if (extensionInstalled) {
            // For Electron >=9.
            if (electron_1.session.defaultSession.removeExtension) {
                const extensionId = electron_1.session.defaultSession
                    .getAllExtensions()
                    .find((e) => e.name).id;
                electron_1.session.defaultSession.removeExtension(extensionId);
            }
            else {
                electron_1.BrowserWindow.removeDevToolsExtension(extensionName);
            }
        }
        // For Electron >=9.
        if (electron_1.session.defaultSession.loadExtension) {
            return electron_1.session.defaultSession
                .loadExtension(extensionFolder, loadExtensionOptions)
                .then((ext) => {
                return Promise.resolve(ext.name);
            });
        }
        const name = electron_1.BrowserWindow.addDevToolsExtension(extensionFolder); // eslint-disable-line
        fs.writeFileSync(getIDMapPath(), JSON.stringify(Object.assign(IDMap, {
            [chromeStoreID]: name,
        })));
        return Promise.resolve(name);
    });
};
exports.default = install;
exports.EMBER_INSPECTOR = {
    id: 'bmdblncegkenkacieihfhpjfppoconhi',
    electron: '>=1.2.1',
};
exports.REACT_DEVELOPER_TOOLS = {
    id: 'fmkadmapgofadopljbjfkapdkoienihi',
    electron: '>=1.2.1',
};
exports.BACKBONE_DEBUGGER = {
    id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd',
    electron: '>=1.2.1',
};
exports.JQUERY_DEBUGGER = {
    id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi',
    electron: '>=1.2.1',
};
exports.ANGULARJS_BATARANG = {
    id: 'ighdmehidhipcmcojjgiloacoafjmpfk',
    electron: '>=1.2.1',
};
exports.VUEJS_DEVTOOLS = {
    id: 'nhdogjmejiglipccpnnnanhbledajbpd',
    electron: '>=1.2.1',
};
exports.VUEJS3_DEVTOOLS = {
    id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
    electron: '>=1.2.1',
};
exports.REDUX_DEVTOOLS = {
    id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',
    electron: '>=1.2.1',
};
exports.CYCLEJS_DEVTOOL = {
    id: 'dfgplfmhhmdekalbpejekgfegkonjpfp',
    electron: '>=1.2.1',
};
exports.APOLLO_DEVELOPER_TOOLS = {
    id: 'jdkknkkbebbapilgoeccciglkfbmbnfm',
    electron: '>=1.2.1',
};
exports.MOBX_DEVTOOLS = {
    id: 'pfgnfdagidkfgccljigdamigbcnndkod',
    electron: '>=1.2.1',
};
//# sourceMappingURL=index.js.map