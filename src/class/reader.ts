import * as fs from 'fs';
import * as path from 'path';

export class Reader {
  private foldersToExlcude: string[] = ['node_modules', 'dist', '.git'];
  private extensionToRead = '.feature';

  readFeatureFilesFromFolder(folder: string, onReadFilesFromFolder: Function): void {
    let results: string[] = [];

    fs.readdir(folder, (readdirError: Error, readFilesList: string[]) => {
      if (readdirError) {
        return onReadFilesFromFolder(readdirError, []);
      }

      let pending = readFilesList.length;
      if (!pending) {
        return onReadFilesFromFolder(null, results);
      }

      readFilesList.forEach((readFile: string) => {
        readFile = path.resolve(folder, readFile);

        fs.stat(readFile, (statError, stat) => {
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
        });
      });
    });
  }
}
