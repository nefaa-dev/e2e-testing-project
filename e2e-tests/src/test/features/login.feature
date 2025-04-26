@active
Feature: Login

  Background:
    Given User navigates to the Deep-PCB website


  @login 
  Scenario Outline: [case_id 2962] Valid Login

    Given User Enters Username As <username>
    And   User Enters Password As <password>
    When  User Clicks On Continue Button
    Then  Login Should Be Success

    Examples:
      | username                           | password     |
      | "deeppcb_test+user@instadeep.com"  | "*****user"  |
      | "deeppcb_test+admin@instadeep.com" | "*****admin" |

  @login 
  Scenario: [case_id 2963][case_id 2964] Invalid Login
    Given User Enters Username As <username>
    And   User Enters Password As <password>
    When  User Clicks On Continue Button
    Then  Login Should Fail

    Examples:
      | username                   | password         |
      | "wrong_user@instadeep.com" | "wrong_password" |
      | ""                         | ""               |


