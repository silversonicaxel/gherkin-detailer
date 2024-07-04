#!/usr/bin/env node

import { Configurer } from './class/configurer.js'
import { Reporter } from './class/reporter.js'

const configurer = new Configurer()
const userConfiguration = configurer.fetchData()

const reporter = new Reporter()
reporter.createGherkinsReport(userConfiguration)
