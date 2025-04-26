@active
Feature: Upload Board

    Scenario: [Case ID 47928] User Should Be Able To Upload New Borad Using Different File Types

        When User uploads <firstFile>, <secondFile> and <optionalFile> using <strategy>
        Then The board should be uploaded

        Examples:
            | firstFile                                     | secondFile                              | optionalFile | strategy  |
            | "test-data/dsn_files/valid-board.dsn"         | ""                                      | ""           | "routing" |
            | "test-data/deeppcb_files/example.deeppcb"     | ""                                      | ""           | "routing" |
            | "test-data/zuken_files/required-f1.dsgf"      | "test-data/zuken_files/required-f2.ftf" | ""           | "routing" |
            | "test-data/kicad_files/valid-board.kicad_pcb" | ""                                      | ""           | "routing" |