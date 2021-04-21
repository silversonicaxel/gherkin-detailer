import { Configurer, ConfigurerData } from './configurer';
import { spy, assert, createSandbox, SinonSpy } from 'sinon';
import { expect } from 'chai';

describe('#Configurer', () => {
  const configurer = new Configurer();
  let sandboxSet: any;

  Object.defineProperty(configurer['program'], 'analysis', {
    configurable: true,
    value: ''
  });
  Object.defineProperty(configurer['program'], 'output', {
    configurable: true,
    value: ''
  });

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
    let addOptionStub: SinonSpy<any, any>;
    let parseStub: SinonSpy<any, any>;

    beforeEach(() => {
      storeOptionsAsPropertiesStub = sandboxSet.stub(configurer['program'], 'storeOptionsAsProperties').returns(configurer['program']);
      versionStub = sandboxSet.stub(configurer['program'], 'version').returns(configurer['program']);
      allowUnknownOptionStub = sandboxSet.stub(configurer['program'], 'allowUnknownOption').returns(configurer['program']);
      optionStub = sandboxSet.stub(configurer['program'], 'option').returns(configurer['program']);
      addOptionStub = sandboxSet.stub(configurer['program'], 'addOption').returns(configurer['program']);
      parseStub = sandboxSet.stub(configurer['program'], 'parse').returns(configurer['program']);
    });

    it('should setup the program options', () => {
      configurer['setupOptions']();

      expect(configurer['program']).to.respondTo('storeOptionsAsProperties');
      expect(configurer['program']).to.respondTo('version');
      expect(configurer['program']).to.respondTo('allowUnknownOption');
      expect(configurer['program']).to.respondTo('option');
      expect(configurer['program']).to.respondTo('addOption');
      expect(configurer['program']).to.respondTo('parse');
      assert.calledOnce(storeOptionsAsPropertiesStub);
      assert.calledOnce(versionStub);
      assert.calledOnce(allowUnknownOptionStub);
      assert.callCount(optionStub, 2);
      assert.calledOnce(addOptionStub);
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

      Object.defineProperty(configurer['program'], 'analysis', {
        value: analysisFolder
      });

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);

      Object.defineProperty(configurer['program'], 'analysis', {
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

      Object.defineProperty(configurer['program'], 'output', {
        value: outputFolder
      });

      const data = configurer.fetchData();

      expect(data).to.deep.equal(expectedConfigurerData);

      Object.defineProperty(configurer['program'], 'output', {
        value: ''
      });
    });
  });
});
