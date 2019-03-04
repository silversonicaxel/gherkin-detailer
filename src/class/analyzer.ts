export class Analyzer {
  private featureRegExp = new RegExp('^(feature)+[:]?', 'i');
  private scenarioOutlineRegExp = new RegExp('^(scenario+[ ]+outline)+[:]?', 'i');
  private scenarioRegExp = new RegExp('^(scenario)+[:]?', 'i');
  private stateRegExp = new RegExp('^(given)+[:]?', 'i');
  private actionRegExp = new RegExp('^(when)+[:]?', 'i');
  private outcomeRegExp = new RegExp('^(then)+[:]?', 'i');
  private glueRegExp = new RegExp('^(and|but)+[:]?', 'i');

  getGherkins(listRows: string[]): any {
    const features: string[] = [];
    const scenarios: string[] = [];
    const states: string[] = [];
    const actions: string[] = [];
    const outcomes: string[] = [];
    const files: string[] = [];
    let rowAnalyzed: string | null;
    let currentReadRow = '';

    for (const listRow of listRows) {
      if (rowAnalyzed = this.getValidFeature(listRow)) {
        features.push(rowAnalyzed);
        currentReadRow = 'feature';
      } else if (rowAnalyzed = this.getValidScenarioOutline(listRow)) {
        scenarios.push(rowAnalyzed);
        currentReadRow = 'scenario';
      } else if (rowAnalyzed = this.getValidScenario(listRow)) {
        scenarios.push(rowAnalyzed);
        currentReadRow = 'scenario';
      } else if (rowAnalyzed = this.getValidState(listRow, currentReadRow)) {
        states.push(rowAnalyzed);
        currentReadRow = 'state';
      } else if (rowAnalyzed = this.getValidAction(listRow, currentReadRow)) {
        actions.push(rowAnalyzed);
        currentReadRow = 'action';
      } else if (rowAnalyzed = this.getValidOutcome(listRow, currentReadRow)) {
        outcomes.push(rowAnalyzed);
        currentReadRow = 'outcome';
      } else {
        continue;
      }

      files.push(listRow);
    }

    return { files, features, scenarios, states, actions, outcomes };
  }

  private getValidFeature(listRow: string): string | null {
    const listRowToAnalyze = this.featureRegExp.exec(listRow);
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null;
  }

  private getValidScenarioOutline(listRow: string): string | null {
    const listRowToAnalyze = this.scenarioOutlineRegExp.exec(listRow);
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null;
  }

  private getValidScenario(listRow: string): string | null {
    const listRowToAnalyze = this.scenarioRegExp.exec(listRow);
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null;
  }

  private getValidState(listRow: string, previousRow: string): string | null {
    const listRowToAnalyze = previousRow === 'state' ? this.glueRegExp.exec(listRow) : this.stateRegExp.exec(listRow);
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null;
  }

  private getValidAction(listRow: string, previousRow: string): string | null {
    const listRowToAnalyze = previousRow === 'action' ? this.glueRegExp.exec(listRow) : this.actionRegExp.exec(listRow);
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null;
  }

  private getValidOutcome(listRow: string, previousRow: string): string | null {
    const listRowToAnalyze = previousRow === 'outcome' ? this.glueRegExp.exec(listRow) : this.outcomeRegExp.exec(listRow);
    return listRowToAnalyze ? listRow.replace(listRowToAnalyze[0], '').trim() : null;
  }
}
