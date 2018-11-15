import { expect } from 'chai';
import { Analyzer } from './analyzer';

describe('#Analyzer', () => {
  let analyzer: Analyzer;
  const gherkin = [
    'Feature: Extension Feature',
    'Scenario: Scenario Extension Feature',
    'Given an initial state is set',
    'When an extension action is taken',
    'Then an outcome happens'
  ];

  beforeEach(() => {
    analyzer = new Analyzer();
  });

  describe('#getGherkins', () => {
    it('should initialize the report folder with default one', () => {
      const expectedGherkins = {
        gherkins: [
          'Feature: Extension Feature',
          'Scenario: Scenario Extension Feature',
          'Given an initial state is set',
          'When an extension action is taken',
          'Then an outcome happens'
        ],
        features: [
          'Extension Feature'
        ],
        scenarios: [
          'Scenario Extension Feature'
        ],
        states: [
          'an initial state is set'
        ],
        actions: [
          'an extension action is taken'
        ],
        outcomes: [
          'an outcome happens'
        ]
      };

      const gherkins = analyzer.getGherkins(gherkin);

      expect(gherkins).to.be.deep.equal(expectedGherkins);
    });
  });
});
