# Example

## Default execution

```bash
"gherkin-detailer": "gherkin-detailer"
```

This command starts to read all the files contained in the current folder.

All the **.feature** files will be analyzed in order to retrieve all scenarios written with the gherkins.

Once the analysis is done, an html report will be store in the deafult folder.

```bash
"report/gherkin-detailer"
```


## Custom analysis folder execution

```bash
"gherkin-detailer": "gherkin-detailer -a 'documentation/features'"
```

This command starts to read all the files contained in the folder *documentation/features*.

All the **.feature** files will be analyzed in order to retrieve all scenarios written with the gherkins.

Once the analysis is done, an html report will be store in the deafult folder.

```bash
"report/gherkin-detailer"
```
