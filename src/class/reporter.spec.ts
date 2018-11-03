import { expect } from 'chai';
import { Reporter } from './reporter';


describe('#Reporter', () => {
  let reporter: Reporter;

  beforeEach(() => {
    reporter = new Reporter();
  });

  describe('#createGherkinsReport', () => {
    it('should initialize the report folder with default one', () => {
      reporter.createGherkinsReport();

      expect(reporter['folderToReport']).to.equal('./');
    });

    it('should initialize the report folder with provided one', () => {
      const reportFolder = './fixtures';
      reporter.createGherkinsReport(reportFolder);

      expect(reporter['folderToReport']).to.equal(reportFolder);
    });

    it('should read features files from folder', () => {
      expect(reporter['reader']).to.respondTo('readFeatureFilesFromFolder');
    });
  });
});
