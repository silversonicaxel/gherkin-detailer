[![Build Status](https://travis-ci.org/silversonicaxel/gherkin-detailer.svg?branch=master)](https://travis-ci.org/silversonicaxel/gherkin-detailer)
[![Coverage Status](https://coveralls.io/repos/github/silversonicaxel/gherkin-detailer/badge.svg?branch=master)](https://coveralls.io/github/silversonicaxel/gherkin-detailer?branch=master)

# gherkin-detailer
gherkin-detailer is a tool that checks the gherkins included in you project and list them.

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
gherkin detailer can be installed as a global tool:

```bash
$ npm install -g gherkin-detailer
```

or as a devDependency:

```bash
$ npm install -D gherkin-detailer
```

## Usage
### TBD: example of working usage
If you've installed it as a devDependency, you need to add it in the `script` section of the `package.json`:

```bash
"gherkin-report": "gherkin-detailer"
```

Then the `gherkin-detailer` can be executed in order to have a gherkins report created in a default folder `./report/gherkin-detailer/`


## Help
```bash

$ gherkin-detailer --help

Usage: gherkin-detailer [options] <option>

  Options:

    -v, --version                           Output the version number
    -a, --analysis [analysis]               Select folder to analyse
    -h, --help                              Output usage information

```


# Future improvements
* Customize report folder
* Customize report theme
* Management of Scenario Outlines
* Management of similarities in Gherkins
