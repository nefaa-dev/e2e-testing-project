import { expect, Locator, Page } from "playwright/test";
import { BasePage } from "./basePage";
import { slugify } from "../helper/tools";
import { Endpoints, Regexes } from "../helper/constants";
import { TableTemplate } from "./components/tableTemplate";
import fs from "fs";
import { parse } from "csv-parse/sync";

type TableConfig = [Locator, string[]];

const selectors = {
  newBoardButton: '//button[@data-test="new-board-button"]',
  placement: '//div[@data-testid="Placement"]',
  routing: '//div[@data-testid="Routing"]',
  boardViewer: '//div[@data-testid="Board Viewer"]',
  stepperGrid: '//div[@data-test="stepper-items-grid"]',
  dsnFileButton: '//button[@data-testid="board-type-tab-Dsn"]',
  pcbFileButton: '//button[@data-testid="board-type-tab-Json"]',
  zukenFileButton: '//button[@data-testid="board-type-tab-Zuken"]',
  kicadFileButton: '//button[@data-testid="board-type-tab-Kicad"]',
  altiumFileButton: '//button[@data-testid="board-type-tab-Altium"]',
  emptyBoardPoint: '//input[@data-test="radio-input-empty-board"]',
  currentWiringPoint: '//input[@data-test="radio-input-current-wiring"]',
  boardNameInput: '//input[@data-testid="boardName"]',
  submitButton: '//button[@data-testid="upload-submit-button"]',
  nextButton: '//button[contains(@data-testid, "next-button")]',
  cancelButton: '//button[@data-test="new-board-cancel-button"]',
  dsnFileInput: '(//div[@data-testid="boardFile-DsnFile"])[2]',
  pcbFileInput: '(//div[@data-testid="boardFile-JsonFile"])[2]',
  dsgfFileInput: '(//div[@data-testid="boardFile-ZukenDesignFile"])[2]',
  ftfFileInput: '(//div[@data-testid="boardFile-ZukenFootprintFile"])[2]',
  kicadFileInput: '(//div[@data-testid="boardFile-KicadBoardFile"])[2]',
  kicadProFileInput: '(//div[@data-testid="boardFile-KicadProjectFile"])[2]',
  stepperUpload: '[data-test="stepper-icon-upload"]',
  stepperBoardCheck: '[data-test="stepper-icon-check"]',
  stepperBoardSetup: '[data-test="stepper-icon-boardSetup"]',
  stepperNetClasses: '[data-test="stepper-icon-netClasses"]',
  stepperDiffPairs: '[data-test="stepper-icon-diffPairs"]',
  stepperNetPriority: '[data-test="stepper-icon-netPriority"]',
  stepperLayers: '[data-test="stepper-icon-layers"]',
  netClassesTable: '[data-testid="net-classes-table"]',
  diffPairsTable: '[data-testid="base-data-table"]',
  searchInput: 'input[placeholder="Find a board"]',
  projectNameCol: 'td[data-test="project-name-column-valid-board"] input',
  messageProjectNotFound: "p.MuiTypography-root.MuiTypography-body2.css-lerth2",
  noDataMessage: "h3.MuiTypography-root.MuiTypography-h3.css-vd9h9l",
};
export class AddOrderPage extends BasePage {
  private addOrderPageUrl: string;
  private strategyMap: Record<string, string>;
  private routingPointMap: Record<string, string>;
  private buttonsMap: Record<string, string>;
  private fileTypesMap: Record<string, string>;
  private extensionsMap: Record<string, string>;
  private constraintsMap: Record<string, TableConfig>;
  private firstReqFile: string;
  private secondReqFile: string;
  private optionalFile: string;
  constructor(page: Page) {
    super(page);
    this.firstReqFile = "";
    this.secondReqFile = "";
    this.optionalFile = "";
    this.addOrderPageUrl = `${this.baseURL}/add-order`;
    this.strategyMap = {
      placement: selectors.placement,
      routing: selectors.routing,
      boardviewer: selectors.boardViewer,
    };
    this.routingPointMap = {
      emptyboard: selectors.emptyBoardPoint,
      currentwiring: selectors.currentWiringPoint,
    };

    this.buttonsMap = {
      submit: selectors.submitButton,
      cancel: selectors.cancelButton,
    };

    this.fileTypesMap = {
      dsn: selectors.dsnFileButton,
      deeppcb: selectors.pcbFileButton,
      dsgf: selectors.zukenFileButton,
      kicad_pcb: selectors.kicadFileButton,
      altium: selectors.altiumFileButton,
    };

    this.extensionsMap = {
      dsn: selectors.dsnFileInput,
      deeppcb: selectors.pcbFileInput,
      dsgf: selectors.dsgfFileInput,
      ftf: selectors.ftfFileInput,
      kicad_pcb: selectors.kicadFileInput,
      kicad_pro: selectors.kicadProFileInput,
    };

    this.constraintsMap = {
      netClasses: [
        this.page.locator(`${selectors.netClassesTable}`),
        [
          "Name",
          "Clearance",
          "Track Width",
          "Via Definition",
          "Assigned Nets",
          "Actions",
        ],
      ],
      diffPairs: [
        this.page.locator(`${selectors.diffPairsTable}`),
        ["First Net", "Second Net", "Gap", "Actions"],
      ],
    };
  }

  async addNewBoard() {
    await this.click(selectors.newBoardButton);
  }

  async verifyRedirection() {
    await this.WaitForRedirection(this.addOrderPageUrl);
  }

  async verifyStrategies(strategies: any) {
    const keys = Object.keys(strategies);
    for (const key of keys) {
      await this.waitForSelectorToBeVisible(this.strategyMap[slugify(key)]);
    }
  }

  async selectStrategy(strategy: string) {
    await this.click(this.strategyMap[slugify(strategy)]);
  }

  async verifyStepperGrid() {
    await this.waitForSelectorToBeVisible(selectors.stepperGrid);
  }

  async isSelectedFile(selector: string) {
    const elementLocator = await this.locator(selector);
    return await elementLocator.getAttribute("aria-selected");
  }

  async checkSelectedFileType() {
    const isSelected = await this.isSelectedFile(selectors.dsnFileButton);
    expect(isSelected).toEqual("true");
  }

  async checkStartingPoint(
    strategy: string,
    startingPoint: string = "empty board"
  ) {
    if (strategy != "placement")
      await this.elementShouldBe({
        selector: this.routingPointMap[slugify(startingPoint)],
        status: this.elementStates.checked,
      });
  }

  async checkBoardName(filePath: string) {
    const fileName = filePath.substring(
      filePath.lastIndexOf("/") + 1,
      filePath.indexOf(".")
    );
    const actualBoardName = await this.getValue(selectors.boardNameInput);
    expect(actualBoardName).toEqual(fileName);
  }

  async checkButtonStatus(button: string, status: string) {
    await this.elementShouldBe({
      selector: button,
      status: status,
    });
  }
  async uploadBoard(
    firstReqFile: string,
    secondReqFile: string,
    optionalFile: string,
    strategy: string
  ) {
    await this.addNewBoard();
    await this.verifyRedirection();
    await this.verifyStrategies(this.strategyMap);
    await this.selectStrategy(strategy);
    await this.verifyStepperGrid();
    await this.selectFileType(firstReqFile);
    await this.checkStartingPoint(strategy);
    await this.checkBoardName("");
    await this.checkButtonStatus(
      this.buttonsMap.submit,
      this.elementStates.disabled
    );
    await this.uploadFile(firstReqFile);
    this.firstReqFile = firstReqFile;
    await this.uploadFile(secondReqFile);
    this.secondReqFile = secondReqFile;
    await this.uploadFile(optionalFile);
    this.optionalFile = optionalFile;
  }

  async uploadFile(path: string) {
    const fileExtension = path.substring(path.lastIndexOf(".") + 1);
    if (!this.extensionsMap[fileExtension]) {
      console.log(`Unsupported File Extension ${fileExtension}`);
      return;
    }
    const fileChooser = await this.waitForFileChooser(
      this.extensionsMap[fileExtension]
    );
    await fileChooser.setFiles(path);
  }

  async verifyFileUpload(file: string) {
    const fileName = file.substring(file.lastIndexOf("/") + 1);
    if (!fileName) {
      console.log(`File was not provided, either N/A or optional ${fileName}`);
      return "";
    }
    const selector = `//span[@data-testid="${fileName}"]`;
    await this.waitForSelectorToBeVisible(selector);
    return fileName;
  }

  async verifyBoardUpload() {
    const boardName = await this.verifyFileUpload(this.firstReqFile);
    await this.checkBoardName(boardName);
    await this.verifyFileUpload(this.secondReqFile);
    await this.verifyFileUpload(this.optionalFile);
  }

  async selectFileType(filePath: string) {
    const extension = filePath.substring(filePath.lastIndexOf(".") + 1);

    const buttonSelector = this.fileTypesMap[extension];
    if (!buttonSelector) {
      throw new Error(`Unknown File Extension: ${extension}`);
    }
    if (extension === "dsn") {
      this.checkSelectedFileType();
      return;
    }
    await this.click(buttonSelector);
  }

  async clickOnSubmit() {
    await this.click(selectors.submitButton);
  }
  async clickOnNext() {
    await this.click(selectors.nextButton);
  }
  async submitBoard() {
    const responsePromise = this.waitForResponse(`**${Endpoints.boards}`);
    await this.clickOnSubmit();
    await responsePromise;
  }

  async nextStep() {
    await this.clickOnNext();
  }
  async verifyStep(selector: string) {
    const elementLocator = await this.locator(selector);
    const classValue = await elementLocator.getAttribute("class");
    expect(classValue).toContain("fa-circle-check");
  }
  async verifyBoardSubmit() {
    await this.verifyStep(selectors.stepperUpload);
  }

  async verifySuccessStep(selector: string, endpoint: RegExp) {
    if (endpoint != Regexes.boardMetrics) {
      await this.waitForResponse(
        (response) => !!response.url().match(endpoint)
      );
      await this.verifyStep(selector);
      return;
    }
    await this.waitUntilPass(() => this.verifyStep(selector));
  }

  async verifyBoardCheck() {
    await this.verifySuccessStep(
      selectors.stepperBoardCheck,
      Regexes.boardDefault
    );
  }

  async verifyBoardSetUp() {
    await this.nextStep();
    await this.verifySuccessStep(
      selectors.stepperNetClasses,
      Regexes.diffPairs
    );
    await this.nextStep();
    await this.verifySuccessStep(selectors.stepperDiffPairs, Regexes.nets);
    await this.nextStep();
    await this.verifySuccessStep(selectors.stepperNetPriority, Regexes.layers);
    await this.nextStep();
    await this.verifySuccessStep(selectors.stepperLayers, Regexes.boardMetrics);
  }

  async getTable(constraintName: string) {
    let tableArgs: TableConfig = this.constraintsMap[constraintName];
    if (!tableArgs) {
      throw new Error(`Oops! Unknown Constraint: ${constraintName}`);
    }
    return TableTemplate.getInstance(...tableArgs);
  }
  async checkConstraints(constraintName: string) {
    const constraintsTable = await this.getTable(constraintName);
    await constraintsTable.loadTableData();
  }

  async verifyConstraints(constraintName: string, filePath: string) {
    const file = fs.readFileSync(filePath);
    const records = parse(file, {
      columns: true,
      skip_empty_lines: true,
    });
    let expectedHeaders: string[] = [];
    let expectedRows: string[][] = [];
    const tableTemplate: TableTemplate = await this.getTable(constraintName);
    if (records.length === 0) {
      expectedHeaders = tableTemplate.expectedHeaders;
      expectedRows = [["No data found"]];
    } else {
      expectedHeaders = Object.keys(records[0]);
      expectedRows = records.map((row: any) => Object.values(row));
    }
    tableTemplate.assertHeaders(expectedHeaders);
    tableTemplate.assertRows(expectedRows);
  }

  async netClassesShouldBeSuccess() {
    await this.nextStep();
    await this.verifySuccessStep(
      selectors.stepperNetClasses,
      Regexes.diffPairs
    );
  }
}
