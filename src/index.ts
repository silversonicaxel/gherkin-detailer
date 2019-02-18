#!/usr/bin/env node

import { Configurer } from './class/configurer';
import { Reporter } from './class/reporter';

const configurer = new Configurer();
const userConfiguration = configurer.fetchData();

const reporter = new Reporter();
reporter.createGherkinsReport(userConfiguration.analysisFolder);
