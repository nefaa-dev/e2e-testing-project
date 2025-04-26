@active
Feature: Upload Board

    Scenario: [Case ID 47927] User Should Be Able To Upload New Borad Using Different File Types

        When User uploads <firstFile>, <secondFile> and <optionalFile> using <strategy>
        Then The board should be uploaded

        Examples:
            | firstFile                                     | secondFile                              | optionalFile | strategy    |
            | "test-data/dsn_files/valid-board.dsn"         | ""                                      | ""           | "placement" |
            | "test-data/deeppcb_files/example.deeppcb"     | ""                                      | ""           | "placement" |
            | "test-data/zuken_files/required-f1.dsgf"      | "test-data/zuken_files/required-f2.ftf" | ""           | "placement" |
            | "test-data/kicad_files/valid-board.kicad_pcb" | ""                                      | ""           | "placement" |