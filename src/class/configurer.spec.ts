import { Configurer, ConfigurerData } from './configurer';
import { spy, assert, createSandbox, SinonSpy } from 'sinon';
import * as program from 'commander';
import { expect } from 'chai';

// const defaultTheme = 'white';

Object.defineProperty(program, 'analysis', {
  configurable: true,
  value: ''
});
Object.defineProperty(program, 'output', {
  configurable: true,
  value: ''
});
/*Object.defineProperty(program, 'theme', {
  configurable: true,
  value: defaultTheme
});*/

describe('#Configurer', () => {
  const configurer = new Configurer();
  let sandboxSet: any;

  beforeEach(() => {
    sandboxSet = createSandbox();
  });

  afterEach(() => {
    sandboxSet.restore();
  });

  describe('#constructor', () => {
    it('should setup configurer options', () => {
      const fetchDataSpy = spy(configurer, 'fetchData');

      assert.notCalled(fetchDataSpy);
    });
  });

  describe('#setupOptions', () => {
    let storeOptionsAsPropertiesStub: SinonSpy<any, any>;
    let versionStub: SinonSpy<any, any>;
    let allowUnknownOptionStub: SinonSpy<any, any>;
    let optionStub: SinonSpy<any, any>;
    let parseStub: SinonSpy<any, any>;

    beforeEach(() => {
      storeOptionsAsPropertiesStub = sandboxSet.stub(program, 'storeOptionsAsProperties').returns(program);
      versionStub = sandboxSet.stub(program, 'version').returns(program);
      allowUnknownOptionStub = sandboxSet.stub(program, 'allowUnknownOption').returns(program);
      optionStub = sandboxSet.stub(program, 'option').returns(program);
      parseStub = sandboxSet.stub(program, 'parse').returns(program);
    });

    it('should setup the program options', () => {
      configurer['setupOptions']();

      expect(program).to.respondTo('storeOptionsAsProperties');
      expect(program).to.respondTo('version');
      expect(program).to.respondTo('allowUnknownOption');
      expect(program).to.respondTo('option');
      expect(program).to.respondTo('parse');
      assert.calledOnce(storeOptionsAsPropertiesStub);
      assert.calledOnce(versionStub);
      assert.calledOnce(allowUnknownOptionStub);
      assert.callCount(optionStub, 3);
      assert.calledOnce(parseStub);
    });
  });

  describe('#fetchData', () => {
    it('should return configurer default data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: '',
        theme: 'white'
      };

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);
    });

    it('should return customized analysis folder', () => {
      const analysisFolder = 'directory';
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: analysisFolder,
        outputFolder: '',
        theme: 'white'
      };

      Object.defineProperty(program, 'analysis', {
        value: analysisFolder
      });

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);

      Object.defineProperty(program, 'analysis', {
        value: ''
      });
    });

    it('should return customized output folder', () => {
      const outputFolder = 'html/report/features';
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: outputFolder,
        theme: 'white'
      };

      Object.defineProperty(program, 'output', {
        value: outputFolder
      });

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);

      Object.defineProperty(program, 'output', {
        value: ''
      });
    });

    /*it('should return customized report theme', () => {
      const theme = 'black';
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: '',
        theme: theme
      };

      Object.defineProperty(program, 'theme', {
        value: theme
      });

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);

      Object.defineProperty(program, 'theme', {
        value: defaultTheme
      });
    });

    it('should return default report theme', () => {
      const theme = 'white';
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: '',
        theme: 'white'
      };

      Object.defineProperty(program, 'theme', {
        value: theme
      });

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);

      Object.defineProperty(program, 'theme', {
        value: defaultTheme
      });
    });*/
  });
});
