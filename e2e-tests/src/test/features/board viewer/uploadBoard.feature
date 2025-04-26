@active
Feature: Upload Board
    @place
    Scenario: [Case ID 47920] User Should Be Able To Upload New Borad Using Different File Types

        When User uploads <firstFile>, <secondFile> and <optionalFile> using <strategy>
        Then The board should be uploaded

        Examples:
            | firstFile                                     | secondFile                              | optionalFile | strategy       |
            | "test-data/dsn_files/valid-board.dsn"         | ""                                      | ""           | "board viewer" |
            | "test-data/deeppcb_files/example.deeppcb"     | ""                                      | ""           | "board viewer" |
            | "test-data/zuken_files/required-f1.dsgf"      | "test-data/zuken_files/required-f2.ftf" | ""           | "board viewer" |
            | "test-data/kicad_files/valid-board.kicad_pcb" | ""                                      | ""           | "board viewer" |