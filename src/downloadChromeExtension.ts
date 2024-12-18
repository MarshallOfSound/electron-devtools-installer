import * as fs from 'fs';
import * as path from 'path';

import { getPath, downloadFile, changePermissions } from './utils';

const unzip: any = require('unzip-crx-3');

export const downloadChromeExtension = async (
  chromeStoreID: string,
  {
    forceDownload = false,
    attempts = 5,
  }: {
    forceDownload?: boolean;
    attempts?: number;
  } = {},
): Promise<string> => {
  const extensionsStore = getPath();
  if (!fs.existsSync(extensionsStore)) {
    await fs.promises.mkdir(extensionsStore, { recursive: true });
  }
  const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`);

  if (!fs.existsSync(extensionFolder) || forceDownload) {
    if (fs.existsSync(extensionFolder)) {
      await fs.promises.rmdir(extensionFolder, {
        recursive: true,
      });
    }
    const fileURL = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${chromeStoreID}%26uc&prodversion=${process.versions.chrome}`; // eslint-disable-line
    const filePath = path.resolve(`${extensionFolder}.crx`);
    try {
      await downloadFile(fileURL, filePath);

      try {
        await unzip(filePath, extensionFolder);
        changePermissions(extensionFolder, 755);
        return extensionFolder;
      } catch (err) {
        if (!fs.existsSync(path.resolve(extensionFolder, 'manifest.json'))) {
          throw err;
        }
      }
    } catch (err) {
      console.error(`Failed to fetch extension, trying ${attempts - 1} more times`); // eslint-disable-line
      if (attempts <= 1) {
        throw err;
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 200));

      return await downloadChromeExtension(chromeStoreID, {
        forceDownload,
        attempts: attempts - 1,
      });
    }
  }

  return extensionFolder;
};
