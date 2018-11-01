import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

export class Reader {
  private readDirAsync: Function;
  private statAsync: Function;
  private foldersToExlcude: string[] = ['node_modules', 'dist', '.git'];
  private extensionToRead = '.feature';

  constructor () {
    this.readDirAsync = util.promisify(fs.readdir);
    this.statAsync = util.promisify(fs.stat);
  }

  async readFeatureFilesFromFolder(folder: string, onReadFilesFromFolder: Function): Promise<void> {
    let results: string[] = [];

    try {
      const readFilesList: string[] = await this.readDirAsync(folder);
      let pending = readFilesList.length;

      if (!pending) {
        return onReadFilesFromFolder(null, results);
      }

      readFilesList.forEach(async(baseNameReadFile: string) => {
        let readFile = baseNameReadFile;
        readFile = path.resolve(folder, readFile);

        const stat = await this.statAsync(readFile);

        if (stat && stat.isDirectory()) {
          if (this.foldersToExlcude.includes(baseNameReadFile)) {
            return;
          }

          this.readFeatureFilesFromFolder(readFile, (readFilesFromFolderError: Error, readData: string[]) => {
            results = results.concat(readData);
            if (!--pending) {
              onReadFilesFromFolder(null, results);
            }
          });
        } else {
          if (readFile.indexOf(this.extensionToRead) >= 0) {
            results.push(readFile);
          }

          if (!--pending) {
            onReadFilesFromFolder(null, results);
          }
        }
      });
    } catch (readFeatureFilesFromFolderError) {
      onReadFilesFromFolder(readFeatureFilesFromFolderError, []);
    }
  }
}
