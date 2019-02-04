import { Configurer } from './configurer';
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
      const data = configurer.fetchData();
      expect(data).to.deep.equal({ analysisFolder: '' });
    });

    it('should return particular data', () => {
      program['analysisFolder'] = '/directory';
      const data = configurer.fetchData();
      expect(data).to.deep.equal({ analysisFolder: '/directory' });
    });
  });
});
