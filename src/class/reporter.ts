import { Reader } from './reader';

export class Reporter {
  private reader: Reader;
  private folderToReport = './';

  constructor() {
    this.reader = new Reader();
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

    readFiles
      .map(async (readFile: string) => {
        const contentFile = await this.reader.readContentFeatureFile(readFile);

        console.log(contentFile);
      });

    console.log(readFiles);
    return;
  }
}
