import * as program from 'commander';

type ConfigurerData = {
  folder: string;
};

export class Configurer {
  constructor() {
    this.setupOptions();
  }

  private setupOptions(): void {
    const version = '0.2.0';

    program
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-f, --folder [folder]', 'Select report folder')
      .parse(process.argv);
  }

  fetchData(): ConfigurerData {
    return {
      folder: program.folder || ''
    };
  }
}
