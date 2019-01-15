export class Analyzer {
  private featureRegExp = new RegExp('^(feature)+[:]?', 'i');
  private scenarioRegExp = new RegExp('^(scenario)+[:]?', 'i');
  private stateRegExp = new RegExp('^(given)+[:]?', 'i');
  private actionRegExp = new RegExp('^(when)+[:]?', 'i');
  private outcomeRegExp = new RegExp('^(then)+[:]?', 'i');

  getGherkins(listRows: string[]): any {
    const features: string[] = [];
    const scenarios: string[] = [];
    const states: string[] = [];
    const actions: string[] = [];
    const outcomes: string[] = [];
    const files: string[] = [];
    let listRowToAnalyze: RegExpExecArray | null;

    for (const listRow of listRows) {
      if ( (listRowToAnalyze = this.featureRegExp.exec(listRow)) !== null ) {
        features.push(listRow.replace(listRowToAnalyze[0], '').trim());
      } else if ( (listRowToAnalyze = this.scenarioRegExp.exec(listRow)) !== null ) {
        scenarios.push(listRow.replace(listRowToAnalyze[0], '').trim());
      } else if ( (listRowToAnalyze = this.stateRegExp.exec(listRow)) !== null ) {
        states.push(listRow.replace(listRowToAnalyze[0], '').trim());
      } else if ( (listRowToAnalyze = this.actionRegExp.exec(listRow)) !== null ) {
        actions.push(listRow.replace(listRowToAnalyze[0], '').trim());
      } else if ( (listRowToAnalyze = this.outcomeRegExp.exec(listRow)) !== null ) {
        outcomes.push(listRow.replace(listRowToAnalyze[0], '').trim());
      } else {
        continue;
      }

      files.push(listRow);
    }

    return {files, features, scenarios, states, actions, outcomes};
  }

}
