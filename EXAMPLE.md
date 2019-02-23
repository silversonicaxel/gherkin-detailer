# Example

## Default execution

```bash
"gherkin-detailer": "gherkin-detailer"
```

This command starts to read all the files contained in the current folder.

All the **.feature** files will be analysed in order to retrieve all scenarios written with the gherkins.

Once the analysis is done, an html report will be stored in the deafult folder *report/gherkin-detailer/*.


## Custom analysis folder execution

```bash
"gherkin-detailer": "gherkin-detailer -a 'documentation/features/'"
```

This command starts to read all the files contained in the folder *documentation/features/*.

All the **.feature** files will be analysed in order to retrieve all scenarios written with the gherkins.

Once the analysis is done, an html report will be stored in the deafult folder *report/gherkin-detailer/*.


## Custom output folder execution

```bash
"gherkin-detailer": "gherkin-detailer -o 'output/'"
```

This command starts to read all the files contained in the current folder.

All the **.feature** files will be analysed in order to retrieve all scenarios written with the gherkins.

Once the analysis is done, an html report will be stored in the folder *output/*.


## Custom theme execution

```bash
"gherkin-detailer": "gherkin-detailer -t 'black'"
```

This command starts to read all the files contained in the current folder.

All the **.feature** files will be analysed in order to retrieve all scenarios written with the gherkins.

Once the analysis is done, an html report with a custom _black_ theme will be stored in the deafult folder *report/gherkin-detailer/*.
