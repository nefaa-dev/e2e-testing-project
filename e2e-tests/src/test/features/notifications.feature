@active
Feature: Notifications tests
  
  Scenario: [case_id 3035] Notification Management and Profile Redirection
    When I click on notifications icon
    Then The notifications popup is displayed
    When I click on the settings icon
    Then I should be redirected to profile page
    When I click on close button
    Then The notifications popup is closed
