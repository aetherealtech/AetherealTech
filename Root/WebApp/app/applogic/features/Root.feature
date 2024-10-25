Feature: Root

  Scenario: Load Home
    When App [app] is loaded with path "/"
    Then App [app] content is Home Page