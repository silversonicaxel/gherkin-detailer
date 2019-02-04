import * as program from 'commander';

type ConfigurerData = {
  analysisFolder: string;
};

export class Configurer {
  constructor() {
    this.setupOptions();
  }

  private setupOptions(): void {
    const version = '1.0.2';

    program
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-a, --analysis [analysis]', 'Select folder to analyse')
      .parse(process.argv);
  }

  fetchData(): ConfigurerData {
    return {
      analysisFolder: program.analysis || ''
    };
  }
}
