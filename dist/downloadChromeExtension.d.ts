declare const downloadChromeExtension: (chromeStoreID: string, forceDownload?: boolean | undefined, attempts?: number) => Promise<string>;
export default downloadChromeExtension;
