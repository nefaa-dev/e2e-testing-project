#@active
Feature: Share Feedback tests

  
  Scenario: [case_id 3216] Feedback Submission and Cancellation Verification
    When I click on share feedback button
    Then The feedback popup is displayed
    When I click on choose an area dropdown button
    Then Three options are displayed, user experience, customer support and pricing
    When I fill the feedback form with valid <area> and <file> and <details>
    And I click on submit button
    Then The feedback is submitted
    When I click on share feedback button
    And I click on Cancel feedback modal button
    Then verify the feedback modal is closed

    Examples:
      | area | file    | details                   |
      | "0"  | "true"  | "User Experience details" |
      | "1"  | "true"  | "Custom Support details"  |
      | "2"  | "true"  | "Pricing details"         |
      | "0"  | "false" | "User Experience details" |
      | "1"  | "false" | "Custom Support details"  |
      | "2"  | "false" | "Pricing details"         |



  
  Scenario: Feedback Submission with missing mandatory fields
    When I click on share feedback button
    Then The feedback popup is displayed
    And the button submit is disabled
    When I click on choose an area dropdown button
    Then Three options are displayed, user experience, customer support and pricing
    When I fill the feedback form with valid <area> and <file> and <details>
    Then the button submit is disabled

    Examples:
      | area | file    | details |
      | "0"  | "false" | ""      |
      | "1"  | "false" | ""      |
      | "2"  | "false" | ""      |
      | "0"  | "true"  | ""      |
      | "1"  | "true"  | ""      |
      | "2"  | "true"  | ""      |


