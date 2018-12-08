import * as chai from 'chai';
import { spy, assert, sandbox, createSandbox } from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Reporter } from './reporter';
import { Analyzer } from './analyzer';
import { Reader } from './reader';

const expect = chai.expect;
chai.use(sinonChai);

describe('#Reporter', () => {
  let reporter: Reporter;
  let analyzer: Analyzer;
  let reader: Reader;
  let sandboxSet: any;

  beforeEach(() => {
    reporter = new Reporter();
    analyzer = new Analyzer();
    reader = new Reader();

    sandboxSet = createSandbox();
  });

  afterEach(() => {
    sandboxSet.restore();
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

  describe('#reportFeaturesFiles', () => {
    it('should not read the provided empty folders', () => {
      const readContentFeatureFileSpy  = spy(reader, 'readContentFeatureFile');
      const getRowsFeatureFileSpy = spy(reader, 'getRowsFeatureFile');
      const getGherkinsSpy = spy(analyzer, 'getGherkins');

      reporter['reportFeaturesFiles'](<any>null, []);

      expect(reader).to.respondTo('readContentFeatureFile');
      expect(reader).to.respondTo('getRowsFeatureFile');
      expect(analyzer).to.respondTo('getGherkins');
      assert.notCalled(readContentFeatureFileSpy);
      assert.notCalled(getRowsFeatureFileSpy);
      assert.notCalled(getGherkinsSpy);
    });

    it('should read provided folders', async () => {
      const readContentFeatureFileData = 'Content File';
      const readContentFeatureFileStub = sandboxSet.stub(reader, 'readContentFeatureFile').returns(readContentFeatureFileData);
      const getRowsFeatureFileData = 'Rows File';
      const getRowsFeatureFileStub = sandboxSet.stub(reader, 'getRowsFeatureFile').returns(getRowsFeatureFileData);
      const getGherkinsData = 'Gherkins';
      const getGherkinsStub = sandboxSet.stub(analyzer, 'getGherkins').returns(getGherkinsData);

      const fileList = ['./fixtures/features/base.feature'];
      reporter['reportFeaturesFiles'](<any>null, fileList);

      await reader.readContentFeatureFile(fileList[0]);
      await reader.getRowsFeatureFile(readContentFeatureFileData);
      await analyzer.getGherkins([getRowsFeatureFileData]);

      expect(analyzer).to.respondTo('getGherkins');
      assert.called(readContentFeatureFileStub);
      assert.calledWith(readContentFeatureFileStub, fileList[0]);
      assert.called(getRowsFeatureFileStub);
      assert.calledWith(getRowsFeatureFileStub, readContentFeatureFileData);
      assert.called(getGherkinsStub);
      assert.calledWith(getGherkinsStub, [getRowsFeatureFileData]);
    });
  });
});
