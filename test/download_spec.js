// Pre-run
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiFs from 'chai-fs';
import fs from 'fs';
import path from 'path';

// Actual Test Imports
import downloadChromeExtension from '../src/downloadChromeExtension';
import { REACT_DEVELOPER_TOOLS } from '../src/';

chai.use(chaiAsPromised);
chai.use(chaiFs);
chai.should();

describe('Extension Downloader', () => {
  describe('when given a valid extension ID', () => {
    it('should return a valid path', (done) => {
      downloadChromeExtension(REACT_DEVELOPER_TOOLS.id)
        .then((dir) => {
          dir.should.be.a.directory();
          done();
        })
        .catch(err => done(err));
    });

    it('should download a valid extension', (done) => {
      downloadChromeExtension(REACT_DEVELOPER_TOOLS.id)
        .then((dir) => {
          dir.should.be.a.directory();
          path.resolve(dir, 'manifest.json').should.be.a.file();
          done();
        })
        .catch(err => done(err));
    });

    describe('with the force parameter', () => {
      it('should always re-download the extension', (done) => {
        downloadChromeExtension(REACT_DEVELOPER_TOOLS.id)
          .then((dir) => {
            dir.should.be.a.directory();
            fs.writeFileSync(path.resolve(dir, 'old_ext.file'), '__TEST__');
            path.resolve(dir, 'manifest.json').should.be.a.file();
            path.resolve(dir, 'old_ext.file').should.be.a.file();

            downloadChromeExtension(REACT_DEVELOPER_TOOLS.id, true)
              .then((newDir) => {
                newDir.should.be.equal(dir);
                newDir.should.be.a.directory();
                path.resolve(newDir, 'manifest.json').should.be.a.file();
                fs.existsSync(path.resolve(newDir, 'old_ext.file')).should.be.equal(false);
                done();
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      });
    });
  });

  describe('when given an invalid extension ID', () => {
    it('should reject the promise', () =>
      downloadChromeExtension('YOLO SWAGGINGS').should.be.rejected,
    );
  });
});
