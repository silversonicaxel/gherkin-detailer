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

  readFeatureFilesFromFolder(folder: string, onReadFilesFromFolder: Function): void {
    let results: string[] = [];

    this.readDirAsync(folder)
      .then((readFilesList: string[]) => {
        let pending = readFilesList.length;
        if (!pending) {
          return onReadFilesFromFolder(null, results);
        }

        readFilesList.forEach((readFile: string) => {
          readFile = path.resolve(folder, readFile);

          this.statAsync(readFile)
            .then((stat: any) => {
              if (stat && stat.isDirectory()) {
                if (this.foldersToExlcude.includes(readFile)) {
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
            })
            .catch((statError: Error) => {
              return onReadFilesFromFolder(statError, []);
            });
        });
      })
      .catch((readdirError: Error) => {
        return onReadFilesFromFolder(readdirError, []);
      });
  }
}
