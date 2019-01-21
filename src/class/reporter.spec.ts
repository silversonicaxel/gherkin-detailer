import * as chai from 'chai';
import { spy, assert, createSandbox, useFakeTimers } from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Reporter } from './reporter';
import { Analyzer } from './analyzer';
import { Reader } from './reader';
import * as fs from 'fs';
import * as del from 'del';
import * as Mustache from 'mustache';

const expect = chai.expect;
chai.use(sinonChai);

describe('#Reporter', () => {
  let reporter: Reporter;
  let analyzer: Analyzer;
  let reader: Reader;
  let sandboxSet: any;

  beforeEach(() => {
    reporter = new Reporter();
    reporter['templates'] = {
      meta: 'meta',
      footer: 'footer',
      menu: 'menu',
      files: 'files',
      features: 'features',
      scenarios: 'scenarios'
    };
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

  describe('#readAllGherkins', () => {
    it('should not read the provided empty folders', () => {
      const readContentFeatureFileSpy  = spy(reader, 'readContentFeatureFile');
      const getRowsFeatureFileSpy = spy(reader, 'getRowsFeatureFile');
      const getGherkinsSpy = spy(analyzer, 'getGherkins');

      reporter['readAllGherkins']([]);

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
      reporter['readAllGherkins'](fileList);

      await reader.readContentFeatureFile(fileList[0]);
      await reader.getRowsFeatureFile(readContentFeatureFileData);
      await analyzer.getGherkins([getRowsFeatureFileData]);

      expect(analyzer).to.respondTo('getGherkins');
      assert.calledOnce(readContentFeatureFileStub);
      assert.calledWith(readContentFeatureFileStub, fileList[0]);
      assert.calledOnce(getRowsFeatureFileStub);
      assert.calledWith(getRowsFeatureFileStub, readContentFeatureFileData);
      assert.calledOnce(getGherkinsStub);
      assert.calledWith(getGherkinsStub, [getRowsFeatureFileData]);
    });
  });

  describe('#readAllTemplates', () => {
    it('should not read the provided empty folders', () => {
      const readContentFeatureFileSpy  = spy(reader, 'readContentFeatureFile');

      reporter['readAllTemplates']();

      expect(reader).to.respondTo('readContentFeatureFile');
      assert.notCalled(readContentFeatureFileSpy);
    });

    it('should read provided folders', async () => {
      const readContentFeatureFileData = 'Content File';
      const readContentFeatureFileStub = sandboxSet.stub(reader, 'readContentFeatureFile').returns(readContentFeatureFileData);

      const fileList = ['./fixtures/features/base.feature'];
      reporter['readAllTemplates']();

      await reader.readContentFeatureFile(fileList[0]);

      assert.calledOnce(readContentFeatureFileStub);
      assert.calledWith(readContentFeatureFileStub, fileList[0]);
    });
  });

  describe('#prepareReports', () => {
    it('set all full digits date and time in templates view', () => {
      const now = new Date(2019, 9, 20, 13, 22, 30, 0);
      const clock = useFakeTimers(now.getTime());

      reporter['prepareReports']();

      expect(reporter['templatesView'].date).to.equal('2019/10/20');
      expect(reporter['templatesView'].time).to.equal('13:22:30');

      clock.restore();
    });

    it('set not full digits date and time in templates view', () => {
      const now = new Date(2019, 0, 5, 2, 3, 4, 0);
      const clock = useFakeTimers(now.getTime());

      reporter['prepareReports']();

      expect(reporter['templatesView'].date).to.equal('2019/01/05');
      expect(reporter['templatesView'].time).to.equal('02:03:04');

      clock.restore();
    });

    it('set list of gherkins in templates view', () => {
      const expectedGherkins = ['a', 'b'];
      reporter['gherkins'] = expectedGherkins;

      reporter['prepareReports']();

      expect(reporter['templatesView'].list).to.equal(expectedGherkins);
    });

    it('set data in templates partials', () => {
      const expectedMeta = '<meta />';
      const expectedFooter = '<footer>footer</footer>';
      reporter['templates'] = {
        meta: expectedMeta,
        menu: 'menu',
        footer: expectedFooter,
        files: '',
        features: '',
        scenarios: ''
      };

      reporter['prepareReports']();

      expect(reporter['templatePartials'].meta).to.equal(expectedMeta);
      expect(reporter['templatePartials'].footer).to.equal(expectedFooter);
    });
  });

  describe('#writeFilesReport', () => {
    it('should call the rendering functionality', () => {
      const filesReportTemplate = '<html></html>';
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(filesReportTemplate);
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile');
      const writeFileDestination = `${reporter['folderToWriteReport']}files.html`;

      reporter['writeFilesReport']();

      assert.calledOnce(mustacheRenderStub);
      assert.calledWith(mustacheRenderStub, reporter['templates'].files, reporter['templatesView'], reporter['templatePartials']);
      assert.calledOnce(fsWriteFileStub);
      assert.calledWith(fsWriteFileStub, writeFileDestination, filesReportTemplate);
    });

    it('should return an error', () => {
      const writeError = 'No file written';
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError);
      const consoleStub = sandboxSet.stub(console, 'error');

      reporter['writeFilesReport']();

      assert.calledOnce(fsWriteFileStub);
      assert.calledWith(fsWriteFileStub);
      expect(consoleStub).to.have.been.calledWith(writeError);
    });
  });

  describe('#writeFeaturesReport', () => {
    it('should call the rendering functionality', () => {
      const filesReportTemplate = '<html></html>';
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(filesReportTemplate);
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile');
      const writeFileDestination = `${reporter['folderToWriteReport']}features.html`;

      reporter['writeFeaturesReport']();

      assert.calledOnce(mustacheRenderStub);
      assert.calledWith(mustacheRenderStub, reporter['templates'].features, reporter['templatesView'], reporter['templatePartials']);
      assert.calledOnce(fsWriteFileStub);
      assert.calledWith(fsWriteFileStub, writeFileDestination, filesReportTemplate);
    });

    it('should return an error', () => {
      const writeError = 'No file written';
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError);
      const consoleStub = sandboxSet.stub(console, 'error');

      reporter['writeFeaturesReport']();

      assert.calledOnce(fsWriteFileStub);
      assert.calledWith(fsWriteFileStub);
      expect(consoleStub).to.have.been.calledWith(writeError);
    });
  });

  describe('#writeScenariosReport', () => {
    it('should call the rendering functionality', () => {
      const filesReportTemplate = '<html></html>';
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(filesReportTemplate);
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile');
      const writeFileDestination = `${reporter['folderToWriteReport']}scenarios.html`;

      reporter['writeScenariosReport']();

      assert.calledOnce(mustacheRenderStub);
      assert.calledWith(mustacheRenderStub, reporter['templates'].scenarios, reporter['templatesView'], reporter['templatePartials']);
      assert.calledOnce(fsWriteFileStub);
      assert.calledWith(fsWriteFileStub, writeFileDestination, filesReportTemplate);
    });

    it('should return an error', () => {
      const writeError = 'No file written';
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError);
      const consoleStub = sandboxSet.stub(console, 'error');

      reporter['writeScenariosReport']();

      assert.calledOnce(fsWriteFileStub);
      assert.calledWith(fsWriteFileStub);
      expect(consoleStub).to.have.been.calledWith(writeError);
    });
  });

  describe('#reportFeaturesFiles', () => {
    it('should create report frome features file', async () => {
      const reporterReadAllGherkinsStub = sandboxSet.stub(reporter, 'readAllGherkins');
      const readAllTemplatesStub = sandboxSet.stub(reporter, 'readAllTemplates');
      const prepareReportsStub = sandboxSet.stub(reporter, 'prepareReports');
      const writeFilesReportStub = sandboxSet.stub(reporter, 'writeFilesReport');
      const writeFeaturesReportStub = sandboxSet.stub(reporter, 'writeFeaturesReport');
      const writeScenariosReportStub = sandboxSet.stub(reporter, 'writeScenariosReport');

      const emptyError = <unknown>null;
      const readFiles = [
        'Feature: Extension Feature',
        'Scenario: Scenario Extension Feature',
        'Given an initial state is set',
        'When an extension action is taken',
        'Then an outcome happens'
      ];

      await reporter['reportFeaturesFiles'](<Error>emptyError, readFiles);

      assert.calledOnce(reporterReadAllGherkinsStub);
      assert.calledWith(reporterReadAllGherkinsStub, readFiles);
      assert.calledOnce(readAllTemplatesStub);
      assert.calledWith(readAllTemplatesStub);

      assert.calledOnce(prepareReportsStub);
      assert.calledWith(prepareReportsStub);
      assert.calledOnce(writeFilesReportStub);
      assert.calledWith(writeFilesReportStub);
      assert.calledOnce(writeFeaturesReportStub);
      assert.calledWith(writeFeaturesReportStub);
      assert.calledOnce(writeScenariosReportStub);
      assert.calledWith(writeScenariosReportStub);
    });

    it('should do nothing due to an error', () => {
      const reporterReadAllGherkinsStub = sandboxSet.stub(reporter, 'readAllGherkins');
      const readError = <unknown>'random error';

      reporter['reportFeaturesFiles'](<Error>readError, []);

      assert.notCalled(reporterReadAllGherkinsStub);
    });
  });
});
