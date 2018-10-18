import { Reader } from './class/reader';
import { Detailer } from './class/detailer';

const reader = new Reader();
const detailer = new Detailer();

reader.readFeatureFilesFromFolder('./', detailer.detailFeaturesFiles);
