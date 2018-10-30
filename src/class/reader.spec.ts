import { expect } from 'chai';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { Reader } from './reader';

describe('#Reader', () => {
  let reader: Reader;
  let executeWhenRead: Function;

  beforeEach(() => {
    reader = new Reader();
  });

  describe('#constructor', () => {
    it('should call promisify', async () => {
      expect(util).to.respondTo('promisify');
    });
  });

  describe('#readFeatureFilesFromFolder', () => {
    beforeEach(() => {
      executeWhenRead = () => {};
    });

    it('should read the initial folder', async () => {
      await reader.readFeatureFilesFromFolder('./fixtures/', executeWhenRead);

      expect(reader).to.respondTo('readDirAsync');
      expect(fs).to.respondTo('readdir');
    });

    it('should read folders recursively', async () => {
      await reader.readFeatureFilesFromFolder('./fixtures/', executeWhenRead);

      expect(path).to.respondTo('resolve');
      expect(reader).to.respondTo('statAsync');
      expect(reader).to.respondTo('readFeatureFilesFromFolder');
    });
  });
});
