@active
Feature: Logout 

    Background:
      Given User is in profile page

     @logout
    Scenario: [case_id 3034] User Should Be Able To Logout 
      When User clicks on logout button
      Then User should be logged out
