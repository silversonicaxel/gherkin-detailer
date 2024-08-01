import { Command, Option } from 'commander'

export type ConfigurerData = {
  analysisFolder?: string
  outputFolder?: string
  theme: string
}

export class Configurer {
  private program: any

  constructor() {
    this.program = new Command()
    this.setupOptions()
  }

  private setupOptions(): void {
    const version = '2.3.0'

    this.program
      .storeOptionsAsProperties(true)
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-a, --analysis <analysis>', 'Select folder to analyse')
      .option('-o, --output <output>', 'Select folder to output')
      .addOption(new Option('-t, --theme <theme>', 'Select report theme').choices(['white', 'black']).default('white'))
      .parse(process.argv)
  }

  fetchData(): ConfigurerData {
    const opts = this.program.opts()

    const userAnalysisFolder = opts.analysis || ''
    const userOutputFolder = opts.output || ''
    const userTheme = opts.theme

    return {
      analysisFolder: userAnalysisFolder,
      outputFolder: userOutputFolder,
      theme: userTheme
    }
  }
}
