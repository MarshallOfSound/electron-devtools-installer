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
    currentVersion = Object.getOwnPropertyDescriptor(process.versions, 'electron');
  });

  describe('when using a compatable version of electron', () => {
    it('should resolve the promise', () =>
      installExtension(REACT_DEVELOPER_TOOLS).should.be.fulfilled);
  });

  describe('when using a major bump compatable version of electron', () => {
    it('should resolve the promise', () => {
      Object.defineProperty(process.versions, 'electron', { value: '3.0.0', configurable: true });
      return installExtension(REACT_DEVELOPER_TOOLS).should.be.fulfilled;
    });
  });

  describe('when using an incompatable version of electron', () => {
    it('should reject the promise', () => {
      Object.defineProperty(process.versions, 'electron', { value: '0.37.2', configurable: true });
      return installExtension(REACT_DEVELOPER_TOOLS).should.be.rejected;
    });
  });

  describe('when using a compatable beta version of electron', () => {
    it('should resolve the promise', () => {
      Object.defineProperty(process.versions, 'electron', {
        value: '1.8.2-beta.3',
        configurable: true,
      });
      return installExtension(REACT_DEVELOPER_TOOLS).should.be.fulfilled;
    });
  });

  afterEach(() => {
    Object.defineProperty(process.versions, 'electron', currentVersion);
  });
});
