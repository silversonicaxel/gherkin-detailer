[![Build Status](https://travis-ci.org/silversonicaxel/gherkin-detailer.svg?branch=master)](https://travis-ci.org/silversonicaxel/gherkin-detailer)
[![Coverage Status](https://coveralls.io/repos/github/silversonicaxel/gherkin-detailer/badge.svg?branch=master)](https://coveralls.io/github/silversonicaxel/gherkin-detailer?branch=master)

# gherkin-detailer
gherkin-detailer is a tool that checks the gherkin files included in you project and list them, highlighting some of their details.

## Documentation
* [Summary](SUMMARY.md)
* [Gitbook](https://silversonicaxel.gitbook.io/gherkin-detailer/)

## Introduction
gherkin-detailer is a tool that generates HTML reports related to the gherkins that are part of the project you are working on. Currently there are six sections available:
* Files list (containing the entire list of all the detailed scenarios)
* Features list (containing the simple list of all the features)
* Scenarios list (containing the simple list of all the scenarios)
* States list (containing the simple list of all the **given** - states)
* Actions list (containing the simple list of all the **when** - actions)
* Outcomes list (containing the simple list of all the **then** - outcomes)

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

To customize the output folder, set this up:
```bash
"gherkin-detailer": "gherkin-detailer -o './report/'"
```

To customize the report theme, set this up:
```bash
"gherkin-detailer": "gherkin-detailer -t 'black'"
```


Then the `gherkin-detailer` can be executed in order to have a gherkins report created in a default folder `./report/gherkin-detailer/`

```bash
$ npm run gherkin-detailer

$ yarn gherkin-detailer
```

## Help
```bash

$ gherkin-detailer --help

Usage: gherkin-detailer [options] <option>

  Options:

    -v, --version                           Output the version number
    -a, --analysis [analysis]               Select folder to analyse
    -o, --output [output]                   Select folder to output
    -t, --theme [theme]                     Select report theme (white|black)
    -h, --help                              Output usage information

```

## Future improvements
* Management of Scenario Outlines
* Management of similarities in Gherkins
