import FuzzySet from 'fuzzyset.js'

export type AnalyzerSimilarity = {
  id: string
  type: string
  text: string
}

export type AnalyzerRow = {
  id: string
  text: string
  class?: string
  similarities?: AnalyzerSimilarity[]
}

export class Analyzer {
  private featureRegExp = new RegExp('^(feature)+[:]?', 'i')
  private scenarioOutlineRegExp = new RegExp('^(scenario+[ ]+outline)+[:]?', 'i')
  private scenarioRegExp = new RegExp('^(scenario)+[:]?', 'i')
  private stateRegExp = new RegExp('^(given)+[:]?', 'i')
  private actionRegExp = new RegExp('^(when)+[:]?', 'i')
  private outcomeRegExp = new RegExp('^(then)+[:]?', 'i')
  private glueRegExp = new RegExp('^(and|but)+[:]?', 'i')
  private examplesTitleRegExp = new RegExp('^(examples|example)', 'i')
  private examplesDataRegExp = new RegExp('^[|]', 'i')

  getGherkins(listRows: string[], index: number): any {
    const features: AnalyzerRow[] = []
    const scenarios: AnalyzerRow[] = []
    const states: AnalyzerRow[] = []
    const actions: AnalyzerRow[] = []
    const outcomes: AnalyzerRow[] = []
    const files: AnalyzerRow[] = []
    let rowAnalyzed: string | null
    let currentId = ''
    let currentReadRow = ''

    for (const listRow of listRows) {
      if (rowAnalyzed = this.getValidFeature(listRow)) {
        currentReadRow = 'feature'
        currentId = `fe-${index}-${features.length}`
        features.push({ id: currentId, text: rowAnalyzed})
      } else if (rowAnalyzed = this.getValidScenarioOutline(listRow)) {
        currentReadRow = 'scenario'
        currentId = `sc-${index}-${scenarios.length}`
        scenarios.push({ id: currentId, text: rowAnalyzed})
      } else if (rowAnalyzed = this.getValidScenario(listRow)) {
        currentReadRow = 'scenario'
        currentId = `sc-${index}-${scenarios.length}`
        scenarios.push({ id: currentId, text: rowAnalyzed})
      } else if (rowAnalyzed = this.getValidState(listRow, currentReadRow)) {
        currentReadRow = 'state'
        currentId = `st-${index}-${states.length}`
        states.push({ id: currentId, text: rowAnalyzed})
      } else if (rowAnalyzed = this.getValidAction(listRow, currentReadRow)) {
        currentReadRow = 'action'
        currentId = `ac-${index}-${actions.length}`
        actions.push({ id: currentId, text: rowAnalyzed})
      } else if (rowAnalyzed = this.getValidOutcome(listRow, currentReadRow)) {
        currentReadRow = 'outcome'
        currentId = `ou-${index}-${outcomes.length}`
        outcomes.push({ id: currentId, text: rowAnalyzed})
      } else if (rowAnalyzed = this.getValidExampleTitle(listRow)) {
        currentReadRow = 'example'
        currentId = ''
      } else if (rowAnalyzed = this.getValidExampleData(listRow, currentReadRow)) {
        currentReadRow = 'example'
        currentId = ''
      } else {
        currentId = ''
        continue
      }
      files.push({ id: currentId, text: listRow})
    }

    return { files, features, scenarios, states, actions, outcomes }
  }

  getSimilarities(gherkinsTexts: string[], gherkinsObjects: AnalyzerRow[]): any {
    const similarities: any = { }

    for (let index = 0; index < gherkinsObjects.length; index++) {
      const totalGherkins = [...gherkinsTexts]
      totalGherkins.splice(index, 1)
      const fuzzySetHandler = FuzzySet(totalGherkins, false)
      const fuzzySetReport = fuzzySetHandler.get(gherkinsObjects[index].text, [], 0.75)

      if (fuzzySetReport && fuzzySetReport.length) {
        const gherkinId = gherkinsObjects[index].id
        similarities[gherkinId] = { }
        similarities[gherkinId].class = (fuzzySetReport[0][0] === 1) ? 'equal' : 'similar'
        similarities[gherkinId].similarities = this.getListSimilarities(fuzzySetReport, gherkinsObjects, gherkinId)
      }
    }

    return similarities
  }

  private getListSimilarities(report: any[], gherkins: any, gherkinId: string): AnalyzerSimilarity[] {
    const similarGherkins = report.map((elem: any) => elem[1])
    return gherkins
      .filter((elem: any) => elem.id !== gherkinId)
      .filter((elem: any) => similarGherkins.includes(elem.text))
      .map((elem: any) => {
        return <AnalyzerSimilarity>{ id: elem.id, type: this.getSimilarityLinkType(elem.id), text: elem.text }
      })
  }

  private getSimilarityLinkType(similarityId: string): string {
    const similarityPrefix = similarityId.substring(0, 2)

    let similarityType: string

    switch (similarityPrefix) {
      case 'fe':
        similarityType = 'features'
        break

      case 'sc':
        similarityType =  'scenarios'
        break

      case 'st':
        similarityType =  'states'
        break

      case 'ac':
        similarityType =  'actions'
        break

      case 'ou':
        similarityType =  'outcomes'
        break

      default:
        similarityType = ''
        break
    }

    return similarityType
  }

  private getValidFeature(listRow: string): string | null {
    const listRowToAnalyze = this.featureRegExp.exec(listRow)
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null
  }

  private getValidScenarioOutline(listRow: string): string | null {
    const listRowToAnalyze = this.scenarioOutlineRegExp.exec(listRow)
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null
  }

  private getValidScenario(listRow: string): string | null {
    const listRowToAnalyze = this.scenarioRegExp.exec(listRow)
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null
  }

  private getValidState(listRow: string, previousRow: string): string | null {
    const listRowToAnalyze = previousRow === 'state' ? this.glueRegExp.exec(listRow) : this.stateRegExp.exec(listRow)
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null
  }

  private getValidAction(listRow: string, previousRow: string): string | null {
    const listRowToAnalyze = previousRow === 'action' ? this.glueRegExp.exec(listRow) : this.actionRegExp.exec(listRow)
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null
  }

  private getValidOutcome(listRow: string, previousRow: string): string | null {
    const listRowToAnalyze = previousRow === 'outcome'
      ? this.glueRegExp.exec(listRow)
      : this.outcomeRegExp.exec(listRow)
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null
  }

  private getValidExampleTitle(listRow: string): string | null {
    const listRowToAnalyze = this.examplesTitleRegExp.exec(listRow)
    return listRowToAnalyze ? listRowToAnalyze[0].trim() : null
  }

  private getValidExampleData(listRow: string, previousRow: string): string | null {
    if (previousRow === 'example') {
      const listRowToAnalyze = this.examplesDataRegExp.exec(listRow)
      return listRowToAnalyze ? listRow.trim() : null
    }
    return null
  }
}
