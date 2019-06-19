import { expect } from 'chai';
import { Analyzer } from './analyzer';
import { assert, createSandbox } from 'sinon';

describe('#Analyzer', () => {
  let analyzer: Analyzer;
  const gherkin = [
    'Feature: Extension Feature',
    'Scenario: Scenario Extension Feature',
    'Given an initial state is set',
    'When an extension action is taken',
    'Then an outcome happens',
    '',
    'This line is not part of the report',
    'Scenario Outline: Scenario Outline Feature with <a> and <b>',
    'Given an initial state is set',
    'When an action is taken',
    'Then an outcome happens',
    '',
    'Examples',
    '| a | b |',
    '| 1 | 2 |',
    '| 4 | 3 |'
  ];
  const indexReadFile = 2;

  let sandboxSet: any;

  beforeEach(() => {
    analyzer = new Analyzer();
    sandboxSet = createSandbox();
  });

  describe('#getGherkins', () => {
    it('should initialize the report folder with default one', () => {
      const expectedGherkins = {
        files: [
          { id: `fe-${indexReadFile}-0`, text: 'Feature: Extension Feature' },
          { id: `sc-${indexReadFile}-0`, text: 'Scenario: Scenario Extension Feature' },
          { id: `st-${indexReadFile}-0`, text: 'Given an initial state is set' },
          { id: `ac-${indexReadFile}-0`, text: 'When an extension action is taken' },
          { id: `ou-${indexReadFile}-0`, text: 'Then an outcome happens' },
          { id: `sc-${indexReadFile}-1`, text: 'Scenario Outline: Scenario Outline Feature with <a> and <b>' },
          { id: `st-${indexReadFile}-1`, text: 'Given an initial state is set' },
          { id: `ac-${indexReadFile}-1`, text: 'When an action is taken' },
          { id: `ou-${indexReadFile}-1`, text: 'Then an outcome happens' },
          { id: '', text: 'Examples' },
          { id: '', text: '| a | b |' },
          { id: '', text: '| 1 | 2 |' },
          { id: '', text: '| 4 | 3 |' }
        ],
        features: [
          { id: `fe-${indexReadFile}-0`, text: 'Extension Feature' }
        ],
        scenarios: [
          { id: `sc-${indexReadFile}-0`, text: 'Scenario Extension Feature' },
          { id: `sc-${indexReadFile}-1`, text: 'Scenario Outline Feature with <a> and <b>' }
        ],
        states: [
          { id: `st-${indexReadFile}-0`, text: 'an initial state is set' },
          { id: `st-${indexReadFile}-1`, text: 'an initial state is set' }
        ],
        actions: [
          { id: `ac-${indexReadFile}-0`, text: 'an extension action is taken' },
          { id: `ac-${indexReadFile}-1`, text: 'an action is taken' }
        ],
        outcomes: [
          { id: `ou-${indexReadFile}-0`, text: 'an outcome happens' },
          { id: `ou-${indexReadFile}-1`, text: 'an outcome happens' }
        ]
      };

      const gherkins = analyzer.getGherkins(gherkin, indexReadFile);

      expect(gherkins).to.be.deep.equal(expectedGherkins);
    });

    it('should call validation methods', () => {
      const getValidFeatureStub = sandboxSet.stub(analyzer, 'getValidFeature');
      const getValidScenarioOutlineStub = sandboxSet.stub(analyzer, 'getValidScenarioOutline');
      const getValidScenarioStub = sandboxSet.stub(analyzer, 'getValidScenario');
      const getValidStateStub = sandboxSet.stub(analyzer, 'getValidState');
      const getValidActionStub = sandboxSet.stub(analyzer, 'getValidAction');
      const getValidOutcomeStub = sandboxSet.stub(analyzer, 'getValidOutcome');
      const getValidExampleTitleStub = sandboxSet.stub(analyzer, 'getValidExampleTitle');
      const getValidExampleDataStub = sandboxSet.stub(analyzer, 'getValidExampleData');

      analyzer.getGherkins(gherkin, indexReadFile);

      assert.calledWith(getValidFeatureStub);
      assert.calledWith(getValidScenarioOutlineStub);
      assert.calledWith(getValidScenarioStub);
      assert.calledWith(getValidStateStub);
      assert.calledWith(getValidActionStub);
      assert.calledWith(getValidOutcomeStub);
      assert.calledWith(getValidExampleTitleStub);
      assert.calledWith(getValidExampleDataStub);
    });
  });

  describe('#getValidFeature', () => {
    it('should return a valid feature', () => {
      const featureText = 'Create menu';
      const validFeature = `Feature: ${featureText}`;

      const expectedFeature = analyzer['getValidFeature'](validFeature);

      expect(expectedFeature).to.be.not.equal('');
      expect(expectedFeature).to.be.deep.equal(featureText);
    });

    it('should not return a valid feature', () => {
      const invalidFeature = 'This is not valid';

      const expectedFeature = analyzer['getValidFeature'](invalidFeature);

      expect(expectedFeature).to.be.deep.equal(null);
    });
  });

  describe('#getListSimilarities', () => {
    it('should return a similarities array empty', () => {
      const report = [
        [ 0.8, 'Feature: Copy Feature' ],
        [ 0.7945521577046603, 'Feature: Base Feature' ]
      ];
      const gherkins = [ { id: 'fe-0-0', text: 'Feature: Outline Feature' } ];
      const similarities = analyzer['getListSimilarities'](report, gherkins, 'fe-0-1');
      const expectedSimilarities = <any>[];

      expect(similarities).to.be.deep.equal(expectedSimilarities);
    });

    it('should return a similarities array', () => {
      const report = [
        [ 0.8, 'Feature: Copy Feature' ],
        [ 0.7945521577046603, 'Feature: Base Feature' ]
      ];
      const gherkins = [ { id: 'fe-0-0', text: 'Feature: Base Feature' } ];
      const similarities = analyzer['getListSimilarities'](report, gherkins, 'fe-0-1');
      const expectedSimilarities = <any>[{
        id: 'fe-0-0',
        text: 'Feature: Base Feature',
        type: 'features'
      }];

      expect(similarities).to.be.deep.equal(expectedSimilarities);
    });

    it('should return a similarities array except itself', () => {
      const report = [
        [ 0.8, 'Feature: Copy Feature' ],
        [ 0.7945521577046603, 'Feature: Base Feature' ]
      ];
      const gherkins = [ { id: 'fe-0-0', text: 'Feature: Base Feature' } ];
      const similarities = analyzer['getListSimilarities'](report, gherkins, 'fe-0-0');
      const expectedSimilarities = <any>[];

      expect(similarities).to.be.deep.equal(expectedSimilarities);
    });
  });

  describe('#getSimilarityLinkType', () => {
    it('should return features type', () => {
      const type = analyzer['getSimilarityLinkType']('fe-0-1');
      expect(type).to.be.deep.equal('features');
    });

    it('should return scenarios type', () => {
      const type = analyzer['getSimilarityLinkType']('sc-0-1');
      expect(type).to.be.deep.equal('scenarios');
    });

    it('should return states type', () => {
      const type = analyzer['getSimilarityLinkType']('st-0-1');
      expect(type).to.be.deep.equal('states');
    });

    it('should return actions type', () => {
      const type = analyzer['getSimilarityLinkType']('ac-0-1');
      expect(type).to.be.deep.equal('actions');
    });

    it('should return outcomes type', () => {
      const type = analyzer['getSimilarityLinkType']('ou-0-1');
      expect(type).to.be.deep.equal('outcomes');
    });

    it('should return no type', () => {
      const type = analyzer['getSimilarityLinkType']('');
      expect(type).to.be.deep.equal('');
    });
  });

  describe('#getValidScenarioOutline', () => {
    it('should return a valid scenario outline ', () => {
      const scenarioOutlineText = 'A does B';
      const validScenarioOutline = `Scenario Outline: ${scenarioOutlineText}`;

      const expectedScenario = analyzer['getValidScenarioOutline'](validScenarioOutline);

      expect(expectedScenario).to.be.not.equal('');
      expect(expectedScenario).to.be.deep.equal(scenarioOutlineText);
    });

    it('should not return a valid scenario outline', () => {
      const invalidScenarioOutline = 'This is not valid';

      const expectedScenarioOutline = analyzer['getValidScenarioOutline'](invalidScenarioOutline);

      expect(expectedScenarioOutline).to.be.deep.equal(null);
    });
  });

  describe('#getValidScenario', () => {
    it('should return a valid scenario', () => {
      const scenarioText = 'A logged user requests a new credit card';
      const validScenario = `Scenario: ${scenarioText}`;

      const expectedScenario = analyzer['getValidScenario'](validScenario);

      expect(expectedScenario).to.be.not.equal('');
      expect(expectedScenario).to.be.deep.equal(scenarioText);
    });

    it('should not return a valid scenario', () => {
      const invalidScenario = 'This is not valid';

      const expectedScenario = analyzer['getValidScenario'](invalidScenario);

      expect(expectedScenario).to.be.deep.equal(null);
    });
  });

  describe('#getValidState', () => {
    it('should return a valid state within a Given', () => {
      const stateText = 'the cat does this';
      const validState = `Given ${stateText}`;

      const expectedState = analyzer['getValidState'](validState, '');

      expect(expectedState).to.be.not.equal('');
      expect(expectedState).to.be.deep.equal(stateText);
    });

    it('should return a valid state within a And', () => {
      const stateText = 'the cat does that';
      const validState = `And ${stateText}`;

      const expectedState = analyzer['getValidState'](validState, 'state');

      expect(expectedState).to.be.not.equal('');
      expect(expectedState).to.be.deep.equal(stateText);
    });

    it('should return a valid state within a But', () => {
      const stateText = 'the cat does not do that';
      const validState = `But ${stateText}`;

      const expectedState = analyzer['getValidState'](validState, 'state');

      expect(expectedState).to.be.not.equal('');
      expect(expectedState).to.be.deep.equal(stateText);
    });

    it('should not return a valid state', () => {
      const invalidState = 'This is not valid';

      const expectedState = analyzer['getValidState'](invalidState, '');

      expect(expectedState).to.be.deep.equal(null);
    });
  });

  describe('#getValidAction', () => {
    it('should return a valid state within a When', () => {
      const actionText = 'the cat does this';
      const validAction = `When ${actionText}`;

      const expectedAction = analyzer['getValidAction'](validAction, '');

      expect(expectedAction).to.be.not.equal('');
      expect(expectedAction).to.be.deep.equal(actionText);
    });

    it('should return a valid action within a And', () => {
      const actionText = 'the cat does that';
      const validAction = `And ${actionText}`;

      const expectedAction = analyzer['getValidAction'](validAction, 'action');

      expect(expectedAction).to.be.not.equal('');
      expect(expectedAction).to.be.deep.equal(actionText);
    });

    it('should return a valid action within a But', () => {
      const actionText = 'the cat does not do that';
      const validAction = `But ${actionText}`;

      const expectedAction = analyzer['getValidAction'](validAction, 'action');

      expect(expectedAction).to.be.not.equal('');
      expect(expectedAction).to.be.deep.equal(actionText);
    });

    it('should not return a valid action', () => {
      const invalidAction = 'This is not valid';

      const expectedAction = analyzer['getValidAction'](invalidAction, '');

      expect(expectedAction).to.be.deep.equal(null);
    });
  });

  describe('#getValidOutcome', () => {
    it('should return a valid outcome within a Then', () => {
      const outcomeText = 'the cat does this';
      const validOutcome = `Then ${outcomeText}`;

      const expectedOutcome = analyzer['getValidOutcome'](validOutcome, '');

      expect(expectedOutcome).to.be.not.equal('');
      expect(expectedOutcome).to.be.deep.equal(outcomeText);
    });

    it('should return a valid outcome within a And', () => {
      const outcomeText = 'the cat does that';
      const validOutcome = `And ${outcomeText}`;

      const expectedOutcome = analyzer['getValidOutcome'](validOutcome, 'outcome');

      expect(expectedOutcome).to.be.not.equal('');
      expect(expectedOutcome).to.be.deep.equal(outcomeText);
    });

    it('should return a valid outcome within a But', () => {
      const outcomeText = 'the cat does not do that';
      const validOutcome = `But ${outcomeText}`;

      const expectedOutcome = analyzer['getValidOutcome'](validOutcome, 'outcome');

      expect(expectedOutcome).to.be.not.equal('');
      expect(expectedOutcome).to.be.deep.equal(outcomeText);
    });

    it('should not return a valid outcome', () => {
      const invalidOutcome = 'This is not valid';

      const expectedOutcome = analyzer['getValidOutcome'](invalidOutcome, '');

      expect(expectedOutcome).to.be.deep.equal(null);
    });
  });

  describe('#getValidExampleTitle', () => {
    it('should return a valid example title', () => {
      const validExampleTitle = 'Examples';

      const expectedValidExampleTitle = analyzer['getValidExampleTitle'](validExampleTitle);

      expect(expectedValidExampleTitle).to.be.not.equal('');
      expect(expectedValidExampleTitle).to.be.deep.equal(validExampleTitle);
    });

    it('should return nothing', () => {
      const invalidExampleTitle = 'Wrong';

      const expectedValidExampleTitle = analyzer['getValidExampleTitle'](invalidExampleTitle);

      expect(expectedValidExampleTitle).to.be.deep.equal(null);
    });
  });

  describe('#getValidExampleData', () => {
    it('should return a valid example data', () => {
      const validExampleData = `|A|B|`;

      const expectedValidExampleData = analyzer['getValidExampleData'](validExampleData, 'example');

      expect(expectedValidExampleData).to.be.not.equal('');
      expect(expectedValidExampleData).to.be.deep.equal(validExampleData);
    });

    it('should return nothing due to invalid example data', () => {
      const invalidExampleData = 'Wrong';

      const expectedValidExampleData = analyzer['getValidExampleData'](invalidExampleData, 'example');

      expect(expectedValidExampleData).to.be.deep.equal(null);
    });

    it('should return nothing due to invalid previous read line', () => {
      const validExampleData = `|A|B|`;

      const expectedValidExampleData = analyzer['getValidExampleData'](validExampleData, 'state');

      expect(expectedValidExampleData).to.be.deep.equal(null);
    });
  });
});
