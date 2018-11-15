import { Reader } from './reader';
import { Analyzer } from './analyzer';

export class Reporter {
  private reader: Reader;
  private analyzer: Analyzer;
  private folderToReport = './';

  constructor() {
    this.reader = new Reader();
    this.analyzer = new Analyzer();
    this.reportFeaturesFiles = this.reportFeaturesFiles.bind(this);
  }

  createGherkinsReport(folderToDetail?: string): void {
    this.folderToReport = folderToDetail || this.folderToReport;

    this.reader.readFeatureFilesFromFolder(this.folderToReport, this.reportFeaturesFiles);
  }

  private reportFeaturesFiles(readError: Error, readFiles: string[]): void {
    if (readError) {
      console.error(readError);
      return;
    }

    const rowsFiles: any = [];

    readFiles
      .map(async (readFile: string) => {
        const contentFile = await this.reader.readContentFeatureFile(readFile);
        const rowsFile = this.reader.getRowsFeatureFile(contentFile);

        rowsFiles[readFile] = this.analyzer.getGherkins(rowsFile);
        console.log(rowsFiles);
      });

    return;
  }
}
