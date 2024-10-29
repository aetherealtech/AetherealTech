Feature: Root

  Scenario: Load Home
    When App [app] is loaded with path "/"
    Then App [app] content should be Home Page

  Scenario: Navigate Back
    Given Browser [browser]
    And Any List of Pages [pages]
    And App [app] is loaded with pages List of Pages [pages]
    And Any Page [previousPage] in List of Pages [pages]
    And Path Text [previousPath] of Page [previousPage]
    And Browser [browser] previous path is Text [previousPath]
    When Browser [browser] pops state
    Then App [app] content should be Page [previousPage]