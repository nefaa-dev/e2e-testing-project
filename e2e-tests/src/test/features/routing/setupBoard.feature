@active
Feature: Setup Board

    Scenario: [Case ID 53054] Board should be checked and set up successfully

        Given User already uploaded a board using <firstFile>, <secondFile> and <optionalFile> for <strategy>
        When  User submit the board
        Then  the board should be submitted
        And   the board should be checked successfully
        And   the board should be set up successfully

        Examples:
            | firstFile                                     | secondFile                                 | optionalFile | strategy  |
            | "test-data/dsn_files/valid-board.dsn"         | ""                                         | ""           | "routing" |
            | "test-data/deeppcb_files/example.deeppcb"     | ""                                         | ""           | "routing" |
            | "test-data/zuken_files/required-f1.dsgf"      | "test-data/zuken_files/required-f2.ftf"    | ""           | "routing" |
            | "test-data/kicad_files/valid-board.kicad_pcb" | "test-data/kicad_files/option-f.kicad_pro" | ""           | "routing" |



