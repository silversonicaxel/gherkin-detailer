import * as program from 'commander';

export type ConfigurerData = {
  analysisFolder?: string;
  outputFolder?: string;
};

export class Configurer {
  constructor() {
    this.setupOptions();
  }

  private setupOptions(): void {
    const version = '1.1.0';

    program
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-a, --analysis [analysis]', 'Select folder to analyse')
      .option('-o, --output [output]', 'Select folder to output')
      .parse(process.argv);
  }

  fetchData(): ConfigurerData {
    const analysis = program.analysis || '';
    const output = program.output || '';

    return {
      analysisFolder: analysis,
      outputFolder: output
    };
  }
}
