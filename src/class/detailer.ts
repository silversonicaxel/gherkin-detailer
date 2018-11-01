export class Detailer {

  detailFeaturesFiles(readError: Error, readFiles: string[]) {
    if (readError) {
      console.error(readError);
    } else {
      console.log(readFiles);
    }
  }
}
