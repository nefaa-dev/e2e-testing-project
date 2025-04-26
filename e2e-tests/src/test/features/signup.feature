@active
Feature: Signup


  Background:
    Given User clicks on sign up button

  @signup
  Scenario: [case_id 2977][case_id 2981][case_id 2978] Invalid Signup
    When User enter an email "beta-test" and password "P@ssw0rd"
    Then Verify the email input is not valid
    And the user is not Signup

    Examples:
      | username                        | password   |
      | "beta-test"                     | "P@ssw0rd" |
      | "deeperepcb_test@instadeep.com" | "****"     |
      | "beta-test"                     | "****"     |



