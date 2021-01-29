import * as program from 'commander';

export type ConfigurerData = {
  analysisFolder?: string;
  outputFolder?: string;
  theme: string;
};

export class Configurer {
  constructor() {
    this.setupOptions();
  }

  private setupOptions(): void {
    const version = '2.1.4';

    program
      .storeOptionsAsProperties(true)
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-a, --analysis [analysis]', 'Select folder to analyse')
      .option('-o, --output [output]', 'Select folder to output')
      .option('-t, --theme [theme]', 'Select report theme', /^(white|black)$/i, 'white')
      .parse(process.argv);
  }

  fetchData(): ConfigurerData {
    const opts = program.opts();

    const userAnalysisFolder = opts.analysis || '';
    const userOutputFolder = opts.output || '';
    const userTheme = opts.theme;

    return {
      analysisFolder: userAnalysisFolder,
      outputFolder: userOutputFolder,
      theme: userTheme
    };
  }
}
