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
    const version = '1.1.3';

    program
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-a, --analysis [analysis]', 'Select folder to analyse')
      .option('-o, --output [output]', 'Select folder to output')
      .option('-t, --theme [theme]', 'Select report theme', /^(white|black)$/i, 'white')
      .parse(process.argv);
  }

  fetchData(): ConfigurerData {
    const userAnalysisFolder = program.analysis || '';
    const userOutputFolder = program.output || '';
    const userTheme = program.theme;

    return {
      analysisFolder: userAnalysisFolder,
      outputFolder: userOutputFolder,
      theme: userTheme
    };
  }
}
