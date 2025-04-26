@active
Feature: Links Accessibility


  
  Scenario: [case_id 3025][case_id 3024][case_id 3023] User Should Be Able To Access Policies, Help And Contact Us Pages
    When User Clicks On <section>
    Then <section> Page Is Displayed
    Examples:
      | section    |
      | "policies" |
      | "help"     |
# | "contact"  | : TODO : Tobe checked if automatable

