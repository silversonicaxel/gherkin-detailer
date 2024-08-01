[![Coverage Status](https://coveralls.io/repos/github/silversonicaxel/gherkin-detailer/badge.svg?branch=master)](https://coveralls.io/github/silversonicaxel/gherkin-detailer?branch=master)

# gherkin-detailer

`gherkin-detailer` is a powerful tool designed to analyze and optimize your gherkin files within a project. It helps you maintain a clean and efficient codebase by providing an overview of your gherkin files and highlighting potential duplications.

## Documentation

* [Summary](SUMMARY.md)

## Introduction

`gherkin-detailer` is a tool that generates comprehensive HTML reports for the gherkin files in your project. These reports help you manage and optimize your gherkin scenarios, ensuring a cleaner and more efficient codebase. The tool currently provides six detailed sections:

- **Files List**: Contains the entire list of all detailed scenarios.
- **Features List**: Provides a simple list of all the features.
- **Scenarios List**: Offers a simple list of all scenarios and scenario outlines.
- **States List**: Lists all the **Given** states.
- **Actions List**: Lists all the **When** actions.
- **Outcomes List**: Lists all the **Then** outcomes.

Each detail in these sections is color-coded to highlight potential similarities, helping you identify and address code duplication within your project.

## Examples

### Example: Files Section

![example 1](./example1.png "example 1")

The **Files** section lists all the gherkin scenarios across all `*.feature` files in your project. This page serves as a comprehensive documentation of your project, organized by file and detailing all specific use cases.

#### Color Coding

The color coding provides additional insights into the gherkin elements:

- **Red**: Indicates elements that are identical across all gherkins. These elements (actions, outcomes, scenarios, etc.) represent the same entity across different files, suggesting that there should be a single, specific piece of code associated with all of them. Developers should ensure that these red-highlighted elements are consistently implemented and do not require multiple definitions.

- **Orange**: Highlights elements that are similar across gherkins. These elements may represent different entities but with some common attributes. Developers should review these orange-highlighted elements to verify whether the similarities are accurate and whether they truly represent distinct entities with different code. This check helps prevent potential errors and code duplication.

### Example: Actions Section

![example 2](./example2.png "example 2")

The **Actions** section lists all the actions (`When` steps) present in your gherkin files. This page helps developers quickly locate and review all the actions defined across the project.

#### Navigation Menu

The navigation menu allows developers to efficiently move between different sections of the report:

- **Files**: Provides a general overview of all gherkin files in the project.
- **Features**: Lists all the features present in your gherkin files.
- **Scenarios**: Displays all scenarios and scenario outlines.
- **States**: Shows all `Given` states.
- **Actions**: Lists all `When` actions (this section).
- **Outcomes**: Lists all `Then` outcomes.

This menu enables you to switch between sections to gain detailed insights into specific elements of your gherkin files, allowing for thorough analysis and easy navigation throughout the project.

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
