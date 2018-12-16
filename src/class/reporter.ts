import { Reader } from './reader';
import { Analyzer } from './analyzer';
import * as Mustache from 'mustache';
import * as fs from 'fs';
import * as del from 'del';

export class Reporter {
  private reader: Reader;
  private analyzer: Analyzer;
  private folderToReadReport = './';
  private folderToWriteReport = './report/gherkin-detailer/';
  private folderToReadTemplates = './templates/';

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

  private async reportFeaturesFiles(readError: Error, readFiles: string[]): Promise<void> {
    if (readError) {
      console.error(readError);
      return;
    }

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

    const templateFilesList = await this.reader.readContentFeatureFile(`${this.folderToReadTemplates}files.mustache`);
    const reportFilesList = Mustache.render(templateFilesList, {list: rowsFiles});

    fs.writeFile(`${this.folderToWriteReport}index.html`, reportFilesList, writeError => {
      if (writeError) {
        console.error(writeError);
        return;
      }
    });
    return;
  }

  private setupReportFolder(): void {
    if (fs.existsSync(this.folderToWriteReport)) {
      del.sync(this.folderToWriteReport);
    }
    fs.mkdirSync(this.folderToWriteReport, { recursive: true });
    fs.copyFileSync(`${this.folderToReadTemplates}style.css`, `${this.folderToWriteReport}style.css`);
  }
}
