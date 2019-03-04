Feature: Outline Feature

  Scenario Outline: Scenario Outline Feature with <pasta> and <wine>
    Given an initial lunch is prepared with <pasta> and <wine>
    When an action is taken
    Then a <city> is highlighted

    Examples:
      | pasta | wine | city |
      | tortelli | lambrusco | reggio emilia |
      | spaghetti | san giovese | bologna |
      | penne | chianti | firenze |
