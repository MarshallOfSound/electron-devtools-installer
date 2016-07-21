// Pre-run
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

// Actual Test Imports
import installExtension, { REACT_DEVELOPER_TOOLS } from '../src/';

chai.use(chaiAsPromised);
chai.should();

describe('Extension Compatability Checker', () => {
  let currentVersion;

  beforeEach(() => {
    currentVersion = process.versions.electron;
  });

  describe('when using a compatable version of electron', () => {
    it('should resolve the promise', () =>
      installExtension(REACT_DEVELOPER_TOOLS).should.be.fulfilled
    );
  });

  describe('when using an incompatable version of electron', () => {
    it('should reject the promise', () => {
      process.versions.electron = '0.37.2';
      return installExtension(REACT_DEVELOPER_TOOLS).should.be.rejected;
    });
  });

  afterEach(() => {
    process.versions.electron = currentVersion;
  });
});
