import { expect } from 'chai';
import * as fs from 'fs';
import { Reader } from './reader';

describe('#Reader', () => {
  let reader: Reader;

  beforeEach(() => {
    reader = new Reader();
  });

  describe('#readFeatureFilesFromFolder', () => {
    it('should call readdir', () => {
      const done = () => {};
      reader.readFeatureFilesFromFolder('wrong', done);

      expect(fs).to.respondTo('readdir');
    });
  });
});
