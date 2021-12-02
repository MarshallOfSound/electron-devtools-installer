export interface ExtensionReference {
    /**
     * Extension ID
     */
    id: string;
    /**
     * Range of electron versions this extension is supported by
     */
    electron: string;
}
export interface ExtensionOptions {
    /**
     * Ignore whether the extension is already downloaded and redownload every time
     */
    forceDownload?: boolean;
    /**
     * Options passed to session.loadExtension
     */
    loadExtensionOptions?: Record<any, any>;
}
/**
 * @param extensionReference Extension or extensions to install
 * @param options Installation options
 * @returns A promise resolving with the name or names of the extensions installed
 */
declare const install: (extensionReference: ExtensionReference | string | Array<ExtensionReference | string>, options?: ExtensionOptions | boolean) => Promise<string>;
export default install;
export declare const EMBER_INSPECTOR: ExtensionReference;
export declare const REACT_DEVELOPER_TOOLS: ExtensionReference;
export declare const BACKBONE_DEBUGGER: ExtensionReference;
export declare const JQUERY_DEBUGGER: ExtensionReference;
export declare const ANGULARJS_BATARANG: ExtensionReference;
export declare const VUEJS_DEVTOOLS: ExtensionReference;
export declare const VUEJS3_DEVTOOLS: ExtensionReference;
export declare const REDUX_DEVTOOLS: ExtensionReference;
export declare const CYCLEJS_DEVTOOL: ExtensionReference;
export declare const APOLLO_DEVELOPER_TOOLS: ExtensionReference;
export declare const MOBX_DEVTOOLS: ExtensionReference;
