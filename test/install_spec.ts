// Pre-run
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiFs from 'chai-fs';
import { given } from 'mocha-testdata';
import * as path from 'path';
import { BrowserWindow, session as _session } from 'electron';

const { expect } = chai;

const session = _session as any;

// Actual Test Imports
import installExtension, { REACT_DEVELOPER_TOOLS } from '../src/';
import knownExtensions from './testdata/knownExtensions';

chai.use(chaiAsPromised);
chai.use(chaiFs);
chai.should();

describe('Extension Installer', () => {
  describe('when given a valid extension ID', () => {
    given(...knownExtensions).it('should resolve the extension successfully', async (item) => {
      const result = await installExtension(item.id);
      expect(result).to.equal(item.description);
    });

    describe('when attempting to install the same extension twice', () => {
      it('should resolve the promise', (done) => {
        installExtension(REACT_DEVELOPER_TOOLS)
          .then(() => installExtension(REACT_DEVELOPER_TOOLS))
          .then(() => done())
          .catch(() => done('Failed to resolve'));
      });

      it('should upgraded the extension with forceDownload', (done) => {
        const extensionName = 'React Developer Tools';
        const oldVersion = '0.14.0';

        // For Electron >=9.
        if (session.defaultSession.removeExtension) {
          session.defaultSession.removeExtension(extensionName);
        } else {
          BrowserWindow.removeDevToolsExtension(extensionName);
        }

        // For Electron >=9.
        if (session.defaultSession.loadExtension) {
          session.defaultSession
            .loadExtension(path.join(__dirname, 'fixtures/simple_extension'))
            .then((ext: any) => {
              ext.name.should.be.equal(extensionName);
              session.defaultSession
                .getAllExtensions()
                .find((e: any) => e.name === extensionName)
                .version.should.be.equal(oldVersion);

              installExtension(REACT_DEVELOPER_TOOLS, true)
                .then(() => {
                  session.defaultSession
                    .getAllExtensions()
                    .find((e: any) => e.name === extensionName)
                    .version.should.not.be.equal(oldVersion);
                  done();
                })
                .catch((err) => done(err));
            })
            .catch((err: Error) => done(err));
        } else {
          ((BrowserWindow.addDevToolsExtension(
            path.join(__dirname, 'fixtures/simple_extension'),
          ) as any) as string).should.be.equal(extensionName);
          (BrowserWindow.getDevToolsExtensions() as any)[extensionName].version.should.be.equal(
            oldVersion,
          );

          installExtension(REACT_DEVELOPER_TOOLS, true)
            .then(() => {
              (BrowserWindow.getDevToolsExtensions() as any)[
                extensionName
              ].version.should.not.be.equal(oldVersion);
              done();
            })
            .catch((err) => done(err));
        }
      });
    });
  });

  describe('when given an array of valid extensions', () => {
    it('should resolve the promise and install all of them', (done) => {
      installExtension(knownExtensions)
        .then(() => {
          // For Electron >=9.
          if (session.defaultSession.getAllExtensions) {
            const installed = session.defaultSession.getAllExtensions();
            for (const extension of knownExtensions) {
              installed.map((e: any) => e.name).should.include(extension.description);
              const extensionId = installed.find((e: any) => e.name === extension.description).id;
              session.defaultSession.removeExtension(extensionId);
            }
          } else {
            const installed = BrowserWindow.getDevToolsExtensions();
            for (const extension of knownExtensions) {
              installed.should.have.property(extension.description);
              BrowserWindow.removeDevToolsExtension(extension.description);
            }
          }
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('when given an invalid extension ID', () => {
    it('should reject the promise', () => installExtension('YOLO SWAGGINGS').should.be.rejected);
  });

  afterEach((done) => {
    // For Electron >=9.
    if (session.defaultSession.getAllExtensions) {
      session.defaultSession
        .getAllExtensions()
        .forEach((ext: any) => session.defaultSession.removeExtension(ext.id));
    } else {
      const exts = BrowserWindow.getDevToolsExtensions();
      Object.keys(exts).forEach((ext) => BrowserWindow.removeDevToolsExtension(ext));
    }
    setTimeout(done, 200);
  });
});
