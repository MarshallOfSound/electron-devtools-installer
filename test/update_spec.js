// Pre-run
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { given } from 'mocha-testdata';

// Actual Test Imports
import needUpdate from '../src/needUpdate';
import knownExtensions from './testdata/knownExtensions';

chai.use(chaiAsPromised);
chai.should();

describe('Extension Update Checker', () => {
  describe('when given a valid extension ID', () => {
    given(...knownExtensions).it('should need to update (with different version)', item =>
      needUpdate(item.id, '0.0.0').should.become(true),
    );
  });
});
