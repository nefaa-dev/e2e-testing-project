@active
Feature: User Profile

  Background:
    Given   User Is On The Profile Page


  Scenario: [Case ID 3218] User Should Be Able To Update Their Name
    When User updates their <firstName> and <lastName>
    Then Their name should be updated successfully

    Examples:
      | firstName | lastName |
      | "nefaa"   | "ghoul"  |

  Scenario: [Case ID 6565]  User Should Be Able To Set A Profile Photo
    When User updates their <photo>
    Then Their photo should be updated successfully

    Examples:
      | photo                   |
      | "test-data/Feitan.jpeg" |

  Scenario: [Case ID 6567]  User Should Be Able To Delete A Profile Photo
    Given User updated their <photo>
    When  User deletes their <photo>
    Then  Their photo should be deleted successfully

    Examples:
      | photo                   |
      | "test-data/Feitan.jpeg" |

