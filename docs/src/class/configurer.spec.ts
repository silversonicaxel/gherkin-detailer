import { Configurer, ConfigurerData } from './configurer';
import { spy, assert, createSandbox } from 'sinon';
import * as program from 'commander';
import { expect } from 'chai';

describe('#Configurer', () => {
  let configurer: Configurer;
  let sandboxSet: any;

  beforeEach(() => {
    configurer = new Configurer();
    sandboxSet = createSandbox();
  });

  afterEach(() => {
    sandboxSet.restore();
  });

  describe('#constructor', () => {
    it('should setup configurer options', () => {
      const fetchDataSpy  = spy(configurer, 'fetchData');

      assert.notCalled(fetchDataSpy);
    });
  });

  describe('#setupOptions', () => {
    it('should setup the program options', () => {
      configurer['setupOptions']();

      expect(program).to.respondTo('version');
      expect(program).to.respondTo('allowUnknownOption');
      expect(program).to.respondTo('option');
      expect(program).to.respondTo('parse');
    });
  });

  describe('#fetchData', () => {
    it('should return configurer default data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: ''
      };
      program['analysis'] = '';
      program['output'] = '';

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);
    });

    it('should return customized analysis folder', () => {
      const analysisFolder = 'directory';
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: analysisFolder,
        outputFolder: ''
      };
      program['analysis'] = analysisFolder;
      program['output'] = '';

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);
    });

    it('should return customized output folder', () => {
      const outputFolder = 'html/report/features';
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: outputFolder
      };
      program['analysis'] = '';
      program['output'] = outputFolder;

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);
    });
  });
});
