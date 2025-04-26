@active
Feature: Check Differential Pairs

    Scenario: [Case ID 62310] Differential Pairs should be as expected

        Given User already uploaded a board using <firstFile>, <secondFile> and <optionalFile> for <strategy>
        And  User submit the board
        And  the board should be submitted
        And  the board should be checked successfully
        And  Net classes were checked successfully
        When User check <constraints>
        Then <constraints> should be as expected <expConstraints>

        Examples:
            | firstFile                                             | secondFile                                     | optionalFile | strategy  | expConstraints                                      | constraints |
            | "test-data/dsn_files/Bigger-gap-diff-pair-test.dsn"   | ""                                             | ""           | "routing" | "test-data/diffPairs/Bigger-gap-diff-pair-test.csv" | "diffPairs" |
            | "test-data/deeppcb_files/mentor-diffpairs-39.deeppcb" | ""                                             | ""           | "routing" | "test-data/diffPairs/mentor-diffpairs-39.csv"       | "diffPairs" |
            | "test-data/zuken_files/required-f1.dsgf"              | "test-data/zuken_files/required-f2.ftf"        | ""           | "routing" | "test-data/diffPairs/noDiffPairs.csv"               | "diffPairs" |
            | "test-data/kicad_files/mentor-kicad.kicad_pcb"        | "test-data/kicad_files/mentor-kicad.kicad_pro" | ""           | "routing" | "test-data/diffPairs/mentor-kicad.csv"              | "diffPairs" |
