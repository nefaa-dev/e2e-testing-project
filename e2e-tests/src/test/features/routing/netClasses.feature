@active
Feature: Check Net Classes

    Scenario: [Case ID 62307] Net Classes should be as expected

        Given User already uploaded a board using <firstFile>, <secondFile> and <optionalFile> for <strategy>
        And  User submit the board
        And  the board should be submitted
        And  the board should be checked successfully
        When User check <contraints>
        Then <contraints> should be as expected <expConstraints>

        Examples:
            | firstFile                                       | secondFile                                 | optionalFile | strategy  | expConstraints                           | contraints   |
            | "test-data/dsn_files/ChinaCP.dsn"               | ""                                         | ""           | "routing" | "test-data/netClasses/ChinaCP-NC.csv"    | "netClasses" |
            | "test-data/deeppcb_files/forNetClasses.deeppcb" | ""                                         | ""           | "routing" | "test-data/netClasses/forNetClasses.csv" | "netClasses" |
            | "test-data/zuken_files/required-f1.dsgf"        | "test-data/zuken_files/required-f2.ftf"    | ""           | "routing" | "test-data/netClasses/noNetClasses.csv"  | "netClasses" |
            | "test-data/kicad_files/valid-board.kicad_pcb"   | "test-data/kicad_files/option-f.kicad_pro" | ""           | "routing" | "test-data/netClasses/noNetClasses.csv"  | "netClasses" |
