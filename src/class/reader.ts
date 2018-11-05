import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

export class Reader {
  private readDirAsync: Function;
  private statAsync: Function;
  private readFileAsync: Function;
  private foldersToExlcude: string[] = ['node_modules', 'dist', '.git'];
  private extensionToRead = '.feature';

  constructor () {
    this.readDirAsync = util.promisify(fs.readdir);
    this.statAsync = util.promisify(fs.stat);
    this.readFileAsync = util.promisify(fs.readFile);
  }

  async readFeatureFilesFromFolder(folder: string, onReadFilesFromFolder: Function): Promise<void> {
    let results: string[] = [];

    try {
      const readFilesList: string[] = await this.readDirAsync(folder);
      let totalFilesToRead = readFilesList.length;

      if (!totalFilesToRead) {
        return onReadFilesFromFolder(null, results);
      }

      readFilesList
        .map(async(baseNameReadFile: string) => {
          let readFile = baseNameReadFile;
          readFile = path.resolve(folder, readFile);

          const stat = await this.statAsync(readFile);

          if (stat && stat.isDirectory()) {
            this.readFeatureFilesFromFolder(readFile, (readFilesFromFolderError: Error, readData: string[]) => {
              if (!this.foldersToExlcude.includes(baseNameReadFile)) {
                results = results.concat(readData);
              }

              if (!--totalFilesToRead) {
                onReadFilesFromFolder(null, results);
              }
            });
          } else {
            if (readFile.indexOf(this.extensionToRead) >= 0) {
              results.push(readFile);
            }

            if (!--totalFilesToRead) {
              onReadFilesFromFolder(null, results);
            }
          }
        });
    } catch (readFeatureFilesFromFolderError) {
      onReadFilesFromFolder(readFeatureFilesFromFolderError, []);
    }
  }

  async readContentFeatureFile(file: string): Promise<string> {
    try {
      return await this.readFileAsync(file, 'utf8');

    } catch (readContentFeatureFileError) {
      return '';
    }
  }

  getRowsFeatureFile(contentFile: string): string[] {
    let rowsFile = contentFile.split('\n');
    rowsFile = rowsFile
      .map(row => row.trim())
      .filter(row => !(row === ''));

    return rowsFile;
  }
}
