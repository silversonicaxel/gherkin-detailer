import { Reader } from './reader';
import { Analyzer } from './analyzer';
import * as Mustache from 'mustache';
import * as fs from 'fs';
import * as del from 'del';
import * as moment from 'moment';

type ReporterTemplatesList = {
  meta: string;
  footer: string;
  menu: string;
  files: string;
  features: string;
  scenarios: string;
  states: string;
  actions: string;
  outcomes: string;
};

type ReporterTemplateViewList = {
  list: string[];
  date: string;
  time: string;
};

type ReporterTemplatePartialsList = {
  meta: string;
  footer: string;
  menu: string;
};

export class Reporter {
  private reader: Reader;
  private analyzer: Analyzer;
  private folderToReadReport = './';
  private folderToWriteReport = './report/gherkin-detailer/';
  private folderToReadTemplates = './templates/';
  private gherkins: string[] = [];
  private templates: ReporterTemplatesList = <ReporterTemplatesList>{ };
  private templatesView: ReporterTemplateViewList = <ReporterTemplateViewList>{ };
  private templatePartials: ReporterTemplatePartialsList = <ReporterTemplatePartialsList>{ };

  constructor() {
    this.reader = new Reader();
    this.analyzer = new Analyzer();
    this.reportFeaturesFiles = this.reportFeaturesFiles.bind(this);
  }

  createGherkinsReport(folderToDetail?: string): void {
    this.folderToReadReport = folderToDetail || this.folderToReadReport;

    this.setupReportFolder();
    this.reader.readFeatureFilesFromFolder(this.folderToReadReport, this.reportFeaturesFiles);
  }

  private setupReportFolder(): void {
    if (fs.existsSync(this.folderToWriteReport)) {
      del.sync(this.folderToWriteReport);
    }

    fs.mkdirSync(this.folderToWriteReport, { recursive: true });
    fs.copyFileSync(`${this.folderToReadTemplates}style.css`, `${this.folderToWriteReport}style.css`);
  }

  private async readAllGherkins(readFiles: string[]): Promise<string[]> {
    const rowsFiles: any = [];

    await Promise.all(
      readFiles
        .map(async(readFile: string) => {
          const contentFile = await this.reader.readContentFeatureFile(readFile);
          const rowsFile = this.reader.getRowsFeatureFile(contentFile);
          const gherkinsFile = this.analyzer.getGherkins(rowsFile);
          const dataFile = { ...gherkinsFile, file: readFile.replace(process.cwd(), '.') };
          rowsFiles.push(dataFile);
        })
    );
    return rowsFiles;
  }

  private async readAllTemplates(): Promise<ReporterTemplatesList> {
    const templatesNames = ['meta', 'menu', 'footer', 'files', 'features', 'scenarios', 'states', 'actions', 'outcomes'];
    const templates: any = { };
    await Promise.all(
      templatesNames
        .map(async(templateName: string) => {
          const readTemplate = await this.reader.readContentFeatureFile(`${this.folderToReadTemplates}${templateName}.mustache`);
          templates[templateName] = readTemplate;
          return{
            [templateName]: readTemplate
          };
        })
    );

    return templates;
  }

  private prepareReports(): void {
    this.templatesView = {
      list: this.gherkins,
      date: moment().format('YYYY/MM/DD'),
      time: moment().format('HH:mm:ss')
    };

    this.templatePartials = {
      meta: this.templates.meta,
      footer: this.templates.footer,
      menu:  this.templates.menu
    };
  }

  private writeFilesReport(): void {
    const reportFilesList = Mustache.render(this.templates.files, this.templatesView, this.templatePartials);
    fs.writeFile(`${this.folderToWriteReport}files.html`, reportFilesList, writeError => {
      if (writeError) {
        console.error(writeError);
        process.exit(1);
        return;
      }
    });
  }

  private writeFeaturesReport(): void {
    const reportFeaturesList = Mustache.render(this.templates.features, this.templatesView, this.templatePartials);
    fs.writeFile(`${this.folderToWriteReport}features.html`, reportFeaturesList, writeError => {
      if (writeError) {
        console.error(writeError);
        process.exit(1);
        return;
      }
    });
  }

  private writeScenariosReport(): void {
    const reportScenariosList = Mustache.render(this.templates.scenarios, this.templatesView, this.templatePartials);
    fs.writeFile(`${this.folderToWriteReport}scenarios.html`, reportScenariosList, writeError => {
      if (writeError) {
        console.error(writeError);
        process.exit(1);
        return;
      }
    });
  }

  private writeStatesReport(): void {
    const reportStatesList = Mustache.render(this.templates.states, this.templatesView, this.templatePartials);
    fs.writeFile(`${this.folderToWriteReport}states.html`, reportStatesList, writeError => {
      if (writeError) {
        console.error(writeError);
        process.exit(1);
        return;
      }
    });
  }

  private writeActionsReport(): void {
    const reportActionsList = Mustache.render(this.templates.actions, this.templatesView, this.templatePartials);
    fs.writeFile(`${this.folderToWriteReport}actions.html`, reportActionsList, writeError => {
      if (writeError) {
        console.error(writeError);
        process.exit(1);
        return;
      }
    });
  }

  private writeOutcomesReport(): void {
    const reportOutcomesList = Mustache.render(this.templates.outcomes  , this.templatesView, this.templatePartials);
    fs.writeFile(`${this.folderToWriteReport}outcomes.html`, reportOutcomesList, writeError => {
      if (writeError) {
        console.error(writeError);
        process.exit(1);
        return;
      }
    });
  }

  private async reportFeaturesFiles(readError: Error, readFiles: string[]): Promise<void> {
    if (readError) {
      console.error(readError);
      process.exit(1);
      return;
    }

    this.gherkins = await this.readAllGherkins(readFiles);
    this.templates = await this.readAllTemplates();

    this.prepareReports();

    this.writeFilesReport();
    this.writeFeaturesReport();
    this.writeScenariosReport();
    this.writeStatesReport();
    this.writeActionsReport();
    this.writeOutcomesReport();
  }
}
