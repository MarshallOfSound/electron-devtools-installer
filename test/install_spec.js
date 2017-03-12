// Pre-run
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiFs from 'chai-fs';
import { given } from 'mocha-testdata';
import path from 'path';
import { BrowserWindow } from 'electron';

// Actual Test Imports
import installExtension, { REACT_DEVELOPER_TOOLS } from '../src/';
import knownExtensions from './testdata/knownExtensions';

chai.use(chaiAsPromised);
chai.use(chaiFs);
chai.should();

describe('Extension Installer', () => {
  describe('when given a valid extension ID', () => {
    given(...knownExtensions).it('should resolve the extension successfully', item =>
      installExtension(item.id).should.become(item.description),
    );

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
        BrowserWindow.removeDevToolsExtension(extensionName);
        BrowserWindow.addDevToolsExtension(path.join(__dirname, 'fixtures/simple_extension'))
          .should.be.equal(extensionName);
        BrowserWindow.getDevToolsExtensions()[extensionName].version
          .should.be.equal(oldVersion);

        installExtension(REACT_DEVELOPER_TOOLS, true)
          .then(() => {
            BrowserWindow.getDevToolsExtensions()[extensionName].version
              .should.not.be.equal(oldVersion);
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  describe('when given an array of valid extensions', () => {
    it('should resolve the promise and install all of them', (done) => {
      installExtension(knownExtensions)
        .then(() => {
          const installed = BrowserWindow.getDevToolsExtensions();
          for (const extension of knownExtensions) {
            installed.should.have.property(extension.description);
            BrowserWindow.removeDevToolsExtension(extension.description);
          }
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('when given an invalid extension ID', () => {
    it('should reject the promise', () =>
      installExtension('YOLO SWAGGINGS').should.be.rejected,
    );
  });

  after((done) => {
    const exts = BrowserWindow.getDevToolsExtensions();
    Object.keys(exts).forEach(ext => BrowserWindow.removeDevToolsExtension(ext));
    setTimeout(done, 2000);
  });
});
