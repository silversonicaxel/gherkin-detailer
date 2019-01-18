import * as chai from 'chai';
import { spy, assert, createSandbox } from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Reporter } from './reporter';
import { Analyzer } from './analyzer';
import { Reader } from './reader';
import * as fs from 'fs';
import * as del from 'del';

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

      expect(reporter['folderToReadReport']).to.equal('./');
    });

    it('should initialize the report folder with provided one', () => {
      const reportFolder = './fixtures';
      reporter.createGherkinsReport(reportFolder);

      expect(reporter['folderToReadReport']).to.equal(reportFolder);
    });

    it('should read features files from folder', () => {
      reporter.createGherkinsReport();

      expect(reporter['reader']).to.respondTo('readFeatureFilesFromFolder');
    });
  });

  describe('#setupReportFolder', () => {
    it('should delete an old report folder if it exists', () => {
      const existsSyncReturn = true;
      const fsExistsSyncStub = sandboxSet.stub(fs, 'existsSync').returns(existsSyncReturn);
      const delSyncStub = sandboxSet.stub(del, 'sync').returns(existsSyncReturn);
      const fsMkdirSyncStub = sandboxSet.stub(fs, 'mkdirSync').returns(existsSyncReturn);
      const fsCopyFileSyncStub = sandboxSet.stub(fs, 'copyFileSync').returns(existsSyncReturn);
      const templatesFolder = `${reporter['folderToReadTemplates']}style.css`;
      const reportFolder = `${reporter['folderToWriteReport']}style.css`;

      reporter['setupReportFolder']();

      assert.calledOnce(fsExistsSyncStub);
      assert.calledWith(fsExistsSyncStub, reporter['folderToWriteReport']);
      assert.calledOnce(delSyncStub);
      assert.calledWith(delSyncStub, reporter['folderToWriteReport']);
      assert.calledOnce(fsMkdirSyncStub);
      assert.calledWith(fsMkdirSyncStub, reporter['folderToWriteReport'], { recursive: true });
      assert.calledOnce(fsCopyFileSyncStub);
      assert.calledWith(fsCopyFileSyncStub, templatesFolder, reportFolder);
    });

    it('should delete any report folder if it does not exists', () => {
      const existsSyncReturn = false;
      const fsExistsSyncStub = sandboxSet.stub(fs, 'existsSync').returns(existsSyncReturn);
      const delSyncStub = sandboxSet.stub(del, 'sync').returns(existsSyncReturn);
      const fsMkdirSyncStub = sandboxSet.stub(fs, 'mkdirSync').returns(existsSyncReturn);
      const fsCopyFileSyncStub = sandboxSet.stub(fs, 'copyFileSync').returns(existsSyncReturn);

      reporter['setupReportFolder']();

      assert.called(fsExistsSyncStub);
      assert.notCalled(delSyncStub);
      assert.called(fsMkdirSyncStub);
      assert.called(fsCopyFileSyncStub);
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
