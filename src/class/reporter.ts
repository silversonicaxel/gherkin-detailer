import { Reader } from './reader';

export class Reporter {
  private reader: Reader;
  private folderToReport = './';

  constructor() {
    this.reader = new Reader();
  }

  createGherkinsReport(folderToDetail?: string): void {
    this.folderToReport = folderToDetail || this.folderToReport;

    this.reader.readFeatureFilesFromFolder(this.folderToReport, this.reportFeaturesFiles);
  }

  private reportFeaturesFiles(readError: Error, readFiles: string[]) {
    if (readError) {
      console.error(readError);
    } else {
      console.log(readFiles);
    }
  }
}
