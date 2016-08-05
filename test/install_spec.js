// Pre-run
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiFs from 'chai-fs';
import { given } from 'mocha-testdata';

// Actual Test Imports
import installExtension, { REACT_DEVELOPER_TOOLS } from '../src/';
import knownExtensions from './testdata/knownExtensions';

chai.use(chaiAsPromised);
chai.use(chaiFs);
chai.should();

describe('Extension Installer', () => {
  describe('when given a valid extension ID', () => {
    given(...knownExtensions).it('should resolve the extension successfully', (item) =>
      installExtension(item.id).should.become(item.description)
    );

    describe('when attempting to install the same extension twice', () => {
      it('should resolve the promise', (done) => {
        installExtension(REACT_DEVELOPER_TOOLS)
          .then(() => installExtension(REACT_DEVELOPER_TOOLS))
          .then(() => done())
          .catch(() => done('Failed to resolve'));
      });
    });
  });

  describe('when given an invalid extension ID', () => {
    it('should reject the promise', () =>
      installExtension('YOLO SWAGGINGS').should.be.rejected
    );
  });
});
