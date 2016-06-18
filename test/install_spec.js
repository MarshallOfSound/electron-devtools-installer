// Pre-run
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiFs from 'chai-fs';

chai.use(chaiAsPromised);
chai.use(chaiFs);
chai.should();

// Actual Test Imports
import installExtension from '../src/';

// This is the extension ID of React Dev Tools
const reactDevTools = 'fmkadmapgofadopljbjfkapdkoienihi';

describe('Extension Installer', () => {
  describe('when given a valid extension ID', () => {
    it('should resolve the name of the extension', () =>
      installExtension(reactDevTools).should.become('React Developer Tools')
    );
  });

  describe('when given an invalid extension ID', () => {
    it('should reject the promise', () =>
      installExtension('YOLO SWAGGINGS').should.be.rejected
    );
  });
});
