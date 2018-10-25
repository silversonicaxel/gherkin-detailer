import { expect } from 'chai';
import * as fs from 'fs';
import * as util from 'util';
import { Reader } from './reader';

describe('#Reader', () => {
  let reader: Reader;
  let done: Function;

  beforeEach(() => {
    reader = new Reader();
  });

  describe('#constructor', () => {
    it('should call promisify', () => {
      expect(util).to.respondTo('promisify');
    });
  });

  describe('#readFeatureFilesFromFolder', () => {
    beforeEach(() => {
      done = () => {};
    });

    it('should call readdir', () => {
      reader.readFeatureFilesFromFolder('./', done);

      expect(fs).to.respondTo('readdir');
    });

    it('should call stat', () => {
      reader.readFeatureFilesFromFolder('./', done);

      expect(fs).to.respondTo('stat');
    });
  });
});
