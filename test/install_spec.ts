// Pre-run
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiFs from 'chai-fs';
import { given } from 'mocha-testdata';
import * as path from 'path';
import { session } from 'electron';

const { expect } = chai;

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
      expect(result.name).to.equal(item.description);
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

        session.defaultSession.removeExtension(extensionName);

        session.defaultSession
          .loadExtension(path.join(__dirname, 'fixtures/simple_extension'))
          .then((ext) => {
            ext.name.should.be.equal(extensionName);
            session.defaultSession
              .getAllExtensions()
              .find((e) => e.name === extensionName)!
              .version.should.be.equal(oldVersion);

            installExtension(REACT_DEVELOPER_TOOLS, {
              forceDownload: true,
            })
              .then(() => {
                session.defaultSession
                  .getAllExtensions()
                  .find((e) => e.name === extensionName)!
                  .version.should.not.be.equal(oldVersion);
                done();
              })
              .catch((err) => done(err));
          })
          .catch((err: Error) => done(err));
      });
    });
  });

  describe('when given an array of valid extensions', () => {
    it('should resolve the promise and install all of them', (done) => {
      installExtension(knownExtensions)
        .then(() => {
          const installed = session.defaultSession.getAllExtensions();
          for (const extension of knownExtensions) {
            installed.map((e) => e.name).should.include(extension.description);
            const extensionId = installed.find((e) => e.name === extension.description)!.id;
            session.defaultSession.removeExtension(extensionId);
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
    session.defaultSession
      .getAllExtensions()
      .forEach((ext) => session.defaultSession.removeExtension(ext.id));
    setTimeout(done, 200);
  });
});
