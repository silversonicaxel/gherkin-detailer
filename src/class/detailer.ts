export class Detailer {

  detailFeaturesFiles(readError: Error, readFiles: string[]) {
    if (readError) {
      throw readError;
    }

    console.log(readFiles);
  }
}
