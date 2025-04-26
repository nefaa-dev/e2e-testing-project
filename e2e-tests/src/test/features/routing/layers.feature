@active
Feature: Check Layers
    @layers
    Scenario: [Case ID ???] Layers should be as expected

        Given User already uploaded a board using <firstFile>, <secondFile> and <optionalFile> for <strategy>
        And  User submit the board
        And  the board should be submitted
        And  the board should be checked successfully
        And  Net classes were checked successfully
        And  Differential pairs were checked successfully
        And  Net Priorities were checked successfully
        When User check <constraint>
        Then <constraint> should be as expected <expConstraints>

        Examples:
            | firstFile                         | secondFile | optionalFile | strategy  | expConstraints                         | constraint |
            | "test-data/dsn_files/ChinaCP.dsn" | ""         | ""           | "routing" | "test-data/layers/layers-test-dsn.csv" | "layers"   |
# | "test-data/deeppcb_files/forNetClasses.deeppcb" | ""                                         | ""           | "routing" | "test-data/netClasses/forNetClasses.csv" | "layers"   |
# | "test-data/zuken_files/required-f1.dsgf"        | "test-data/zuken_files/required-f2.ftf"    | ""           | "routing" | "test-data/netClasses/noNetClasses.csv"  | "layers"   |
# | "test-data/kicad_files/valid-board.kicad_pcb"   | "test-data/kicad_files/option-f.kicad_pro" | ""           | "routing" | "test-data/netClasses/noNetClasses.csv"  | "layers"   |
