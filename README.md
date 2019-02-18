[![Build Status](https://travis-ci.org/silversonicaxel/gherkin-detailer.svg?branch=master)](https://travis-ci.org/silversonicaxel/gherkin-detailer)
[![Coverage Status](https://coveralls.io/repos/github/silversonicaxel/gherkin-detailer/badge.svg?branch=master)](https://coveralls.io/github/silversonicaxel/gherkin-detailer?branch=master)

# gherkin-detailer
gherkin-detailer is a tool that checks the gherkin files included in you project and list them, highlighting some of their details.

## Introduction
gherkin-detailer is a tool that generates HTML reports related to the gherkins that are part of the project you are working on. Currently there are six sections available:
* Files list
* Features list
* Scenarios list
* States list
* Actions list
* Outcomes list

## Requirements
* node 10.12+
* npm 6.0+

## Installation
gherkin-detailer can be installed as a global tool:

```bash
$ npm install -g gherkin-detailer

$ yarn global add gherkin-detailer
```

or as a devDependency:

```bash
$ npm install -D gherkin-detailer

$ yarn add --dev gherkin-detailer
```

## Usage
If you've installed it as a devDependency, you need to add it in the `script` section of the `package.json`.

To execute it with all default options, so to let its analysis starts from the current folder, set this up:
```bash
"gherkin-detailer": "gherkin-detailer"
```

To customize the analysis folder, set this up:
```bash
"gherkin-detailer": "gherkin-detailer -a './src/'"
```

Then the `gherkin-detailer` can be executed in order to have a gherkins report created in a default folder `./report/gherkin-detailer/`

```bash
$ npm run gherkin-detailer

$ yarn run gherkin-detailer
```

## Help
```bash

$ gherkin-detailer --help

Usage: gherkin-detailer [options] <option>

  Options:

    -v, --version                           Output the version number
    -a, --analysis [analysis]               Select folder to analyse
    -h, --help                              Output usage information

```

## Future improvements
* Customize report folder
* Customize report theme
* Management of Scenario Outlines
* Management of similarities in Gherkins
