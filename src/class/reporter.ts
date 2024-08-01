import { Reader } from './reader.js'
import { Analyzer, AnalyzerRow } from './analyzer.js'
import { ConfigurerData } from './configurer.js'
import Mustache from 'mustache'
import * as fs from 'fs'
import * as del from 'del'
import moment from 'moment'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

type ReporterTemplatesList = {
  meta: string
  footer: string
  menu: string
  files: string
  features: string
  scenarios: string
  states: string
  actions: string
  outcomes: string
}

type ReporterTemplateViewList = {
  list: string[]
  date: string
  time: string
}

type ReporterTemplatePartialsList = {
  meta: string
  footer: string
  menu: string
}

export class Reporter {
  private reader: Reader
  private analyzer: Analyzer
  private theme = 'white'
  private folderToReadReport = `${process.cwd()}/`
  private folderToWriteReport = `${process.cwd()}/report/gherkin-detailer/`
  private folderToReadTemplates = `${dirname(fileURLToPath(import.meta.url))}/../templates/`
  private gherkins: string[] = []
  private templates: ReporterTemplatesList = <ReporterTemplatesList>{ }
  private templatesView: ReporterTemplateViewList = <ReporterTemplateViewList>{ }
  private templatePartials: ReporterTemplatePartialsList = <ReporterTemplatePartialsList>{ }

  constructor() {
    this.reader = new Reader()
    this.analyzer = new Analyzer()
    this.reportFeaturesFiles = this.reportFeaturesFiles.bind(this)
  }

  createGherkinsReport(config: ConfigurerData): void {
    this.theme = config.theme
    this.folderToReadReport = config.analysisFolder || this.folderToReadReport
    this.folderToWriteReport = config.outputFolder || this.folderToWriteReport
    if (this.folderToWriteReport.substr(-1) !== '/') {
      this.folderToWriteReport += '/'
    }

    this.setupReportFolder()
    this.reader.readFeatureFilesFromFolder(this.folderToReadReport, this.reportFeaturesFiles)
  }

  private setupReportFolder(): void {
    if (fs.existsSync(this.folderToWriteReport)) {
      del.deleteSync(this.folderToWriteReport)
    }

    fs.mkdirSync(this.folderToWriteReport, { recursive: true })
    fs.copyFileSync(`${this.folderToReadTemplates}${this.theme}.css`, `${this.folderToWriteReport}style.css`)
  }

  private async readAllGherkins(readFiles: string[]): Promise<string[]> {
    let rowsFiles: any = []

    await Promise.all(
      readFiles
        .map(async(readFile: string, indexFile: number) => {
          const contentFile = await this.reader.readContentFeatureFile(readFile)
          const rowsFile = this.reader.getRowsFeatureFile(contentFile)
          const gherkinsFile = this.analyzer.getGherkins(rowsFile, indexFile)
          const dataFile = { ...gherkinsFile, file: readFile.replace(process.cwd(), '.') }
          rowsFiles.push(dataFile)
        })
    )

    let gherkinsTexts = rowsFiles.map( (rowFile: any) => {
      return rowFile.files.filter((file: any) => file.id !== '').map((file: any) => file.text)
    })
    gherkinsTexts = [].concat(...gherkinsTexts)

    let gherkinsObjects = rowsFiles.map( (rowFile: any) => {
      return rowFile.files.filter((file: any) => file.id !== '').map((file: any) => file)
    })
    gherkinsObjects = [].concat(...gherkinsObjects)

    const similarities = this.analyzer.getSimilarities(gherkinsTexts, gherkinsObjects)

    rowsFiles = rowsFiles.map( (rowFile: any) => {
      rowFile.files = rowFile.files.map((file: any) => {
        return this.addSimilarityInfo(file, similarities)
      })
      rowFile.features = rowFile.features.map((file: any) => {
        return this.addSimilarityInfo(file, similarities)
      })
      rowFile.scenarios = rowFile.scenarios.map((file: any) => {
        return this.addSimilarityInfo(file, similarities)
      })
      rowFile.states = rowFile.states.map((file: any) => {
        return this.addSimilarityInfo(file, similarities)
      })
      rowFile.actions = rowFile.actions.map((file: any) => {
        return this.addSimilarityInfo(file, similarities)
      })
      rowFile.outcomes = rowFile.outcomes.map((file: any) => {
        return this.addSimilarityInfo(file, similarities)
      })

      return rowFile
    })

    return rowsFiles
  }

  private addSimilarityInfo(file: AnalyzerRow, similarities: any): AnalyzerRow {
    if (similarities[file.id]) {
      file.class = similarities[file.id].class
      file.similarities = similarities[file.id].similarities
    }
    return file
  }

  private async readAllTemplates(): Promise<ReporterTemplatesList> {
    const templatesNames = ['meta', 'menu', 'footer', 'files', 'features', 'scenarios', 'states', 'actions', 'outcomes']
    const templates: any = { }

    await Promise.all(
      templatesNames
        .map(async(templateName: string) => {
          const readTemplate =
            await this.reader.readContentFeatureFile(`${this.folderToReadTemplates}${templateName}.mustache`)
          templates[templateName] = readTemplate
          return{
            [templateName]: readTemplate
          }
        })
    )

    return templates
  }

  private prepareReports(): void {
    this.templatesView = {
      list: this.gherkins,
      date: moment().format('YYYY/MM/DD'),
      time: moment().format('HH:mm:ss')
    }

    this.templatePartials = {
      meta: this.templates.meta,
      footer: this.templates.footer,
      menu:  this.templates.menu
    }
  }

  private handleError(error: Error | null): void {
    if (error) {
      console.error(error)
      process.exit(1)
      return
    }

    return
  }

  private writeFilesReport(): void {
    const reportFilesList = Mustache.render(this.templates.files, this.templatesView, this.templatePartials)
    fs.writeFile(`${this.folderToWriteReport}index.html`, reportFilesList, this.handleError)
  }

  private writeFeaturesReport(): void {
    const reportFeaturesList = Mustache.render(this.templates.features, this.templatesView, this.templatePartials)
    fs.writeFile(`${this.folderToWriteReport}features.html`, reportFeaturesList, this.handleError)
  }

  private writeScenariosReport(): void {
    const reportScenariosList = Mustache.render(this.templates.scenarios, this.templatesView, this.templatePartials)
    fs.writeFile(`${this.folderToWriteReport}scenarios.html`, reportScenariosList, this.handleError)
  }

  private writeStatesReport(): void {
    const reportStatesList = Mustache.render(this.templates.states, this.templatesView, this.templatePartials)
    fs.writeFile(`${this.folderToWriteReport}states.html`, reportStatesList, this.handleError)
  }

  private writeActionsReport(): void {
    const reportActionsList = Mustache.render(this.templates.actions, this.templatesView, this.templatePartials)
    fs.writeFile(`${this.folderToWriteReport}actions.html`, reportActionsList, this.handleError)
  }

  private writeOutcomesReport(): void {
    const reportOutcomesList = Mustache.render(this.templates.outcomes  , this.templatesView, this.templatePartials)
    fs.writeFile(`${this.folderToWriteReport}outcomes.html`, reportOutcomesList, this.handleError)
  }

  private async reportFeaturesFiles(readError: Error | null, readFiles: string[]): Promise<void> {
    this.handleError(readError)

    this.gherkins = await this.readAllGherkins(readFiles)
    this.templates = await this.readAllTemplates()

    this.prepareReports()

    this.writeFilesReport()
    this.writeFeaturesReport()
    this.writeScenariosReport()
    this.writeStatesReport()
    this.writeActionsReport()
    this.writeOutcomesReport()
  }
}
