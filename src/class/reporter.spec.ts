import * as chai from 'chai'
import sinonChai from 'sinon-chai'
import { spy, assert, createSandbox, useFakeTimers } from 'sinon'
import { Reporter } from './reporter'
import { Analyzer, AnalyzerRow } from './analyzer'
import { Reader } from './reader'
import { ConfigurerData } from './configurer'
import * as fs from 'fs'
import * as del from 'del'
import * as Mustache from 'mustache'

const expect = chai.expect
chai.use(sinonChai)

describe('#Reporter', () => {
  let reporter: Reporter
  let analyzer: Analyzer
  let reader: Reader
  let sandboxSet: any

  beforeEach(() => {
    reporter = new Reporter()
    reporter['templates'] = {
      meta: 'meta',
      footer: 'footer',
      menu: 'menu',
      files: 'files',
      features: 'features',
      scenarios: 'scenarios',
      states: 'states',
      actions: 'actions',
      outcomes: 'outcomes'
    }
    analyzer = new Analyzer()
    reader = new Reader()

    sandboxSet = createSandbox()

    // @todo: the stub of sandboxSet are commented because they break the skipped tests afterwards
    // sandboxSet.stub(del, 'deleteSync')
    // sandboxSet.stub(fs, 'mkdirSync')
    // sandboxSet.stub(fs, 'copyFileSync')
    sandboxSet.stub(reporter, 'reportFeaturesFiles')
  })

  afterEach(() => {
    sandboxSet.restore()
  })

  describe('#createGherkinsReport', () => {
    it('should initialize the theme with the default one', () => {
      const config = <ConfigurerData>{ analysisFolder: '', outputFolder: '', theme: 'white' }
      reporter.createGherkinsReport(config)

      expect(reporter['theme']).to.equal('white')
    })

    it('should initialize the theme with a provided one', () => {
      const config = <ConfigurerData>{ analysisFolder: '', outputFolder: '', theme: 'black' }
      reporter.createGherkinsReport(config)

      expect(reporter['theme']).to.equal('black')
    })

    it('should initialize the analysis folder with default one', () => {
      const config = <ConfigurerData>{ analysisFolder: '', outputFolder: '', theme: 'white' }
      reporter.createGherkinsReport(config)

      expect(reporter['folderToReadReport']).to.equal(`${process.cwd()}/`)
    })

    it('should initialize the analysis folder with provided one', () => {
      const config = <ConfigurerData>{ analysisFolder: './fixtures', outputFolder: '', theme: 'white' }
      reporter.createGherkinsReport(config)

      expect(reporter['folderToReadReport']).to.equal(config.analysisFolder)
    })

    it('should initialize the output folder with default one', () => {
      sandboxSet.stub(reporter, 'setupReportFolder')
      sandboxSet.stub(reporter['reader'], 'readFeatureFilesFromFolder')

      const config = <ConfigurerData>{ }
      reporter.createGherkinsReport(config)

      expect(reporter['folderToWriteReport']).to.equal(`${process.cwd()}/report/gherkin-detailer/`)
    })

    it('should initialize the output folder with provided one', () => {
      sandboxSet.stub(reporter, 'setupReportFolder')
      sandboxSet.stub(reporter['reader'], 'readFeatureFilesFromFolder')

      const config = <ConfigurerData>{ analysisFolder: '', outputFolder: 'doc/to/report/', theme: 'white' }
      reporter.createGherkinsReport(config)

      expect(reporter['folderToWriteReport']).to.equal(config.outputFolder)
    })

    it('should initialize the output folder with provided one ending with a slash', () => {
      sandboxSet.stub(reporter, 'setupReportFolder')
      sandboxSet.stub(reporter['reader'], 'readFeatureFilesFromFolder')

      const config = <ConfigurerData>{ analysisFolder: '', outputFolder: 'doc/to/report', theme: 'white' }
      reporter.createGherkinsReport(config)

      expect(reporter['folderToWriteReport']).to.equal(`${config.outputFolder}/`)
    })

    it('should read features files from folder', () => {
      const config = <ConfigurerData>{ analysisFolder: '', outputFolder: '', theme: 'white' }
      sandboxSet.stub(reporter, 'setupReportFolder')
      const readFeatureFilesFromFolderStub = sandboxSet.stub(reporter['reader'], 'readFeatureFilesFromFolder')

      reporter.createGherkinsReport(config)

      expect(reporter['reader']).to.respondTo('readFeatureFilesFromFolder')
      assert.calledOnce(readFeatureFilesFromFolderStub)
      assert.calledWith(readFeatureFilesFromFolderStub, reporter['folderToReadReport'], reporter['reportFeaturesFiles'])
    })
  })

  describe.skip('#setupReportFolder', () => {
    it('should delete an old report folder if it exists', () => {
      const existsSyncReturn = true
      const fsExistsSyncStub = sandboxSet.stub(fs, 'existsSync').returns(existsSyncReturn)
      const delSyncStub = sandboxSet.stub(del, 'deleteSync').returns(existsSyncReturn)
      const fsMkdirSyncStub = sandboxSet.stub(fs, 'mkdirSync').returns(existsSyncReturn)
      const fsCopyFileSyncStub = sandboxSet.stub(fs, 'copyFileSync').returns(existsSyncReturn)
      const themeSource = `${reporter['folderToReadTemplates']}${reporter['theme']}.css`
      const themeDestination = `${reporter['folderToWriteReport']}style.css`

      reporter['setupReportFolder']()

      assert.calledOnce(fsExistsSyncStub)
      assert.calledWith(fsExistsSyncStub, reporter['folderToWriteReport'])
      assert.calledOnce(delSyncStub)
      assert.calledWith(delSyncStub, reporter['folderToWriteReport'])
      assert.calledOnce(fsMkdirSyncStub)
      assert.calledWith(fsMkdirSyncStub, reporter['folderToWriteReport'], { recursive: true })
      assert.calledOnce(fsCopyFileSyncStub)
      assert.calledWith(fsCopyFileSyncStub, themeSource, themeDestination)
    })

    it('should delete any report folder if it does not exists', () => {
      const existsSyncReturn = false
      const fsExistsSyncStub = sandboxSet.stub(fs, 'existsSync').returns(existsSyncReturn)
      const delSyncStub = sandboxSet.stub(del, 'deleteSync').returns(existsSyncReturn)
      const fsMkdirSyncStub = sandboxSet.stub(fs, 'mkdirSync').returns(existsSyncReturn)
      const fsCopyFileSyncStub = sandboxSet.stub(fs, 'copyFileSync').returns(existsSyncReturn)

      reporter['setupReportFolder']()

      assert.called(fsExistsSyncStub)
      assert.notCalled(delSyncStub)
      assert.called(fsMkdirSyncStub)
      assert.called(fsCopyFileSyncStub)
    })
  })

  describe('#readAllGherkins', () => {
    it('should not read the provided empty folders', () => {
      const readContentFeatureFileSpy  = spy(reader, 'readContentFeatureFile')
      const getRowsFeatureFileSpy = spy(reader, 'getRowsFeatureFile')
      const getGherkinsSpy = spy(analyzer, 'getGherkins')

      reporter['readAllGherkins']([])

      expect(reader).to.respondTo('readContentFeatureFile')
      expect(reader).to.respondTo('getRowsFeatureFile')
      expect(analyzer).to.respondTo('getGherkins')
      assert.notCalled(readContentFeatureFileSpy)
      assert.notCalled(getRowsFeatureFileSpy)
      assert.notCalled(getGherkinsSpy)
    })

    it('should read provided folders', async () => {
      const readContentFeatureFileData = 'Content File'
      const readContentFeatureFileStub =
        sandboxSet.stub(reader, 'readContentFeatureFile').returns(readContentFeatureFileData)
      const getRowsFeatureFileData = 'Rows File'
      const getRowsFeatureFileIndex = 4
      const getRowsFeatureFileStub = sandboxSet.stub(reader, 'getRowsFeatureFile').returns(getRowsFeatureFileData)
      const getGherkinsData = 'Gherkins'
      const getGherkinsStub = sandboxSet.stub(analyzer, 'getGherkins').returns(getGherkinsData)

      const fileList = ['./fixtures/features/base.feature']
      reporter['readAllGherkins'](fileList)

      await reader.readContentFeatureFile(fileList[0])
      await reader.getRowsFeatureFile(readContentFeatureFileData)
      await analyzer.getGherkins([getRowsFeatureFileData], getRowsFeatureFileIndex)

      expect(analyzer).to.respondTo('getGherkins')
      assert.calledOnce(readContentFeatureFileStub)
      assert.calledWith(readContentFeatureFileStub, fileList[0])
      assert.calledOnce(getRowsFeatureFileStub)
      assert.calledWith(getRowsFeatureFileStub, readContentFeatureFileData)
      assert.calledOnce(getGherkinsStub)
      assert.calledWith(getGherkinsStub, [getRowsFeatureFileData], getRowsFeatureFileIndex)
    })

    it('should analyze similarities', () => {
      const fileList = ['./fixtures/features/base.feature']
      reporter['readAllGherkins'](fileList)

      expect(analyzer).to.respondTo('getSimilarities')
    })
  })

  describe('#addSimilarityInfo', () => {
    it('should provide file with no added info', () => {
      const file = <AnalyzerRow> { id: 'id', text: 'text' }
      const notEnrichedFile = reporter['addSimilarityInfo'](file, [])

      expect(notEnrichedFile).to.equal(file)
    })

    it('should provide file enriched with added info', () => {
      const file = <AnalyzerRow> { id: 'id', text: 'text' }
      const similarities: any = { }
      similarities['id'] = {
        class: 'c',
        similarities: { }
      }
      const enrichedFile = reporter['addSimilarityInfo'](file, similarities)

      expect(enrichedFile.class).to.equal(file.class)
      expect(enrichedFile.similarities).to.equal(file.similarities)
    })
  })

  describe('#readAllTemplates', () => {
    it('should not read the provided empty folders', () => {
      const readContentFeatureFileSpy  = spy(reader, 'readContentFeatureFile')

      reporter['readAllTemplates']()

      expect(reader).to.respondTo('readContentFeatureFile')
      assert.notCalled(readContentFeatureFileSpy)
    })

    it('should read provided folders', async () => {
      const readContentFeatureFileData = 'Content File'
      const readContentFeatureFileStub =
        sandboxSet.stub(reader, 'readContentFeatureFile').returns(readContentFeatureFileData)

      const fileList = ['./fixtures/features/base.feature']
      reporter['readAllTemplates']()

      await reader.readContentFeatureFile(fileList[0])

      assert.calledOnce(readContentFeatureFileStub)
      assert.calledWith(readContentFeatureFileStub, fileList[0])
    })
  })

  describe('#prepareReports', () => {
    it('set all full digits date and time in templates view', () => {
      const now = new Date(2019, 9, 20, 13, 22, 30, 0)
      const clock = useFakeTimers(now.getTime())

      reporter['prepareReports']()

      expect(reporter['templatesView'].date).to.equal('2019/10/20')
      expect(reporter['templatesView'].time).to.equal('13:22:30')

      clock.restore()
    })

    it('set not full digits date and time in templates view', () => {
      const now = new Date(2019, 0, 5, 2, 3, 4, 0)
      const clock = useFakeTimers(now.getTime())

      reporter['prepareReports']()

      expect(reporter['templatesView'].date).to.equal('2019/01/05')
      expect(reporter['templatesView'].time).to.equal('02:03:04')

      clock.restore()
    })

    it('set list of gherkins in templates view', () => {
      const expectedGherkins = ['a', 'b']
      reporter['gherkins'] = expectedGherkins

      reporter['prepareReports']()

      expect(reporter['templatesView'].list).to.equal(expectedGherkins)
    })

    it('set data in templates partials', () => {
      const expectedMeta = '<meta />'
      const expectedMenu = '<nav>menu<nav>'
      const expectedFooter = '<footer>footer</footer>'
      reporter['templates'] = {
        meta: expectedMeta,
        menu: expectedMenu,
        footer: expectedFooter,
        files: '',
        features: '',
        scenarios: '',
        states: '',
        actions: '',
        outcomes: ''
      }

      reporter['prepareReports']()

      expect(reporter['templatePartials'].meta).to.equal(expectedMeta)
      expect(reporter['templatePartials'].menu).to.equal(expectedMenu)
      expect(reporter['templatePartials'].footer).to.equal(expectedFooter)
    })
  })

  describe('#handleError', () => {
    it('should do nothing', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      reporter['handleError'](null)

      assert.notCalled(consoleStub)
      assert.notCalled(processStub)
    })

    it('should return an error', () => {
      const writeError = <unknown>'No file written'
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      reporter['handleError'](<Error>writeError)

      expect(consoleStub).to.have.been.calledWith(writeError)
      expect(processStub).to.have.been.calledWith(1)
    })
  })

  describe.skip('#writeFilesReport', () => {
    it('should call the rendering functionality', () => {
      const filesReportTemplate = '<html></html>'
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(filesReportTemplate)
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile')
      const writeFileDestination = `${reporter['folderToWriteReport']}index.html`

      reporter['writeFilesReport']()

      assert.calledOnce(mustacheRenderStub)
      assert.calledWith(
        mustacheRenderStub,
        reporter['templates'].files,
        reporter['templatesView'],
        reporter['templatePartials']
      )
      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub, writeFileDestination, filesReportTemplate)
    })

    it('should return an error', () => {
      const writeError = 'No file written'
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError)
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      reporter['writeFilesReport']()

      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub)
      expect(consoleStub).to.have.been.calledWith(writeError)
      expect(processStub).to.have.been.calledWith(1)
    })
  })

  describe.skip('#writeFeaturesReport', () => {
    it('should call the rendering functionality', () => {
      const featuresReportTemplate = '<html></html>'
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(featuresReportTemplate)
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile')
      const writeFileDestination = `${reporter['folderToWriteReport']}features.html`

      reporter['writeFeaturesReport']()

      assert.calledOnce(mustacheRenderStub)
      assert.calledWith(
        mustacheRenderStub,
        reporter['templates'].features,
        reporter['templatesView'],
        reporter['templatePartials']
      )
      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub, writeFileDestination, featuresReportTemplate)
    })

    it('should return an error', () => {
      const writeError = 'No file written'
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError)
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      reporter['writeFeaturesReport']()

      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub)
      expect(consoleStub).to.have.been.calledWith(writeError)
      expect(processStub).to.have.been.calledWith(1)
    })
  })

  describe.skip('#writeScenariosReport', () => {
    it('should call the rendering functionality', () => {
      const scenariosReportTemplate = '<html></html>'
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(scenariosReportTemplate)
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile')
      const writeFileDestination = `${reporter['folderToWriteReport']}scenarios.html`

      reporter['writeScenariosReport']()

      assert.calledOnce(mustacheRenderStub)
      assert.calledWith(
        mustacheRenderStub,
        reporter['templates'].scenarios,
        reporter['templatesView'],
        reporter['templatePartials']
      )
      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub, writeFileDestination, scenariosReportTemplate)
    })

    it('should return an error', () => {
      const writeError = 'No file written'
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError)
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      reporter['writeScenariosReport']()

      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub)
      expect(consoleStub).to.have.been.calledWith(writeError)
      expect(processStub).to.have.been.calledWith(1)
    })
  })

  describe.skip('#writeStatesReport', () => {
    it('should call the rendering functionality', () => {
      const statesReportTemplate = '<html></html>'
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(statesReportTemplate)
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile')
      const writeFileDestination = `${reporter['folderToWriteReport']}states.html`

      reporter['writeStatesReport']()

      assert.calledOnce(mustacheRenderStub)
      assert.calledWith(
        mustacheRenderStub,
        reporter['templates'].states,
        reporter['templatesView'],
        reporter['templatePartials']
      )
      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub, writeFileDestination, statesReportTemplate)
    })

    it('should return an error', () => {
      const writeError = 'No file written'
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError)
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      reporter['writeStatesReport']()

      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub)
      expect(consoleStub).to.have.been.calledWith(writeError)
      expect(processStub).to.have.been.calledWith(1)
    })
  })

  describe.skip('#writeActionsReport', () => {
    it('should call the rendering functionality', () => {
      const actionsReportTemplate = '<html></html>'
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(actionsReportTemplate)
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile')
      const writeFileDestination = `${reporter['folderToWriteReport']}actions.html`

      reporter['writeActionsReport']()

      assert.calledOnce(mustacheRenderStub)
      assert.calledWith(
        mustacheRenderStub,
        reporter['templates'].actions,
        reporter['templatesView'],
        reporter['templatePartials']
      )
      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub, writeFileDestination, actionsReportTemplate)
    })

    it('should return an error', () => {
      const writeError = 'No file written'
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError)
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      reporter['writeActionsReport']()

      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub)
      expect(consoleStub).to.have.been.calledWith(writeError)
      expect(processStub).to.have.been.calledWith(1)
    })
  })

  describe.skip('#writeOutcomesReport', () => {
    it('should call the rendering functionality', () => {
      const outcomesReportTemplate = '<html></html>'
      const mustacheRenderStub = sandboxSet.stub(Mustache, 'render').returns(outcomesReportTemplate)
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile')
      const writeFileDestination = `${reporter['folderToWriteReport']}outcomes.html`

      reporter['writeOutcomesReport']()

      assert.calledOnce(mustacheRenderStub)
      assert.calledWith(
        mustacheRenderStub,
        reporter['templates'].outcomes,
        reporter['templatesView'],
        reporter['templatePartials']
      )
      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub, writeFileDestination, outcomesReportTemplate)
    })

    it('should return an error', () => {
      const writeError = 'No file written'
      const fsWriteFileStub = sandboxSet.stub(fs, 'writeFile').yields(writeError)
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      reporter['writeOutcomesReport']()

      assert.calledOnce(fsWriteFileStub)
      assert.calledWith(fsWriteFileStub)
      expect(consoleStub).to.have.been.calledWith(writeError)
      expect(processStub).to.have.been.calledWith(1)
    })
  })

  describe.skip('#reportFeaturesFiles', () => {
    it('should create report frome features file', async () => {
      const reporterReadAllGherkinsStub = sandboxSet.stub(reporter, 'readAllGherkins')
      const readAllTemplatesStub = sandboxSet.stub(reporter, 'readAllTemplates')
      const prepareReportsStub = sandboxSet.stub(reporter, 'prepareReports')
      const writeFilesReportStub = sandboxSet.stub(reporter, 'writeFilesReport')
      const writeFeaturesReportStub = sandboxSet.stub(reporter, 'writeFeaturesReport')
      const writeScenariosReportStub = sandboxSet.stub(reporter, 'writeScenariosReport')
      const writeStatesReportStub = sandboxSet.stub(reporter, 'writeStatesReport')
      const writeActionsReportStub = sandboxSet.stub(reporter, 'writeActionsReport')
      const writeOutcomesReportStub = sandboxSet.stub(reporter, 'writeOutcomesReport')

      const emptyError = <unknown>null
      const readFiles = [
        'Feature: Extension Feature',
        'Scenario: Scenario Extension Feature',
        'Given an initial state is set',
        'When an extension action is taken',
        'And another action is taken',
        'Then an outcome happens'
      ]

      await reporter['reportFeaturesFiles'](<Error>emptyError, readFiles)

      assert.calledOnce(reporterReadAllGherkinsStub)
      assert.calledWith(reporterReadAllGherkinsStub, readFiles)
      assert.calledOnce(readAllTemplatesStub)
      assert.calledWith(readAllTemplatesStub)

      assert.calledOnce(prepareReportsStub)
      assert.calledWith(prepareReportsStub)
      assert.calledOnce(writeFilesReportStub)
      assert.calledWith(writeFilesReportStub)
      assert.calledOnce(writeFeaturesReportStub)
      assert.calledWith(writeFeaturesReportStub)
      assert.calledOnce(writeScenariosReportStub)
      assert.calledWith(writeScenariosReportStub)
      assert.calledOnce(writeStatesReportStub)
      assert.calledWith(writeStatesReportStub)
      assert.calledOnce(writeActionsReportStub)
      assert.calledWith(writeActionsReportStub)
      assert.calledOnce(writeOutcomesReportStub)
      assert.calledWith(writeOutcomesReportStub)
    })

    it('should do nothing due to an error', async () => {
      const readError = <unknown>'random error'
      const handleErrorReportStub = sandboxSet.stub(reporter, 'handleError')

      await reporter['reportFeaturesFiles'](<Error>readError, [])

      assert.calledOnce(handleErrorReportStub)
      assert.calledWith(handleErrorReportStub, readError)
    })
  })
})
