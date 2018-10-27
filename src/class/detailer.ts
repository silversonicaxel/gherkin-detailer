export class Detailer {

  detailFeaturesFiles(readError: Error, readFiles: string[]) {
    if (readError) {
      console.error(readError);
    }

    console.log(readFiles);
  }
}
