// import { Page, expect } from "@playwright/test";
// import { BasePage } from "./basePage";
// import { randomString } from "../helper/string_generator";

// import { mkdtempSync } from "fs";
// import { tmpdir } from "os";
// import { join } from "path";

// const fs = require("fs");

// const selectors = {
//   addNewBoardBtn: "[data-test='new-board-button']",
//   newBoardDialogTitle: "[data-test='new-board-modal-title']",
//   dsnRadioInput: "[data-test='radio-input-Dsn']",
//   zukenDesignRadioInput: "[data-test='radio-input-Zuken']",
//   kicadRadioInput: "[data-test='radio-input-Kicad']",
//   newBoardModalNextBtn: "[data-test='new-board-modal-next-button']",
//   dsnFileInput: "[data-test='DsnFile-file-input']",
//   zukenDesignFileInput: '//input[@accept=".dsgf,.pcf"]',
//   ftfFileInput: '//input[@accept=".ftf"]',
//   rulfFileInput: '//input[@accept=".rulf"]',
//   kicad_pcbFileInput: '//input[@accept=".kicad_pcb"]',
//   jsonFileInput: '//input[@accept=".json"]',
//   kicad_proFileInput: '//input[@accept=".kicad_pro"]',
//   newBoardSubmitButton: "[data-test='new-board-submit-button']",
//   newBoardCancelButton: "[data-test='new-board-cancel-button']",
//   newBoardTitle: "[data-test='new-board-title']",
//   errorStatus: "[data-test='result-status-error']",
//   errorMsg: "//p[starts-with(@data-test, 'error-message')]",
//   cancelButton: "//button[starts-with(@data-test, 'cancel')]",
//   newBoardName: "[data-test='board-name-input']",
//   stepperUpload: "[data-test='stepper-label-upload']",
//   stepperIconUpload: "[data-test='stepper-icon-upload']",
//   uploadedfile: "span.MuiTypography-root.MuiTypography-body3.css-anluzt",

//   boardInfoNameWithError: "[data-test='board-info-field-label-Board Name:']",
//   boardInfoFileNameWithError: "[data-test='board-info-field-value-File Name:']",
// };

// const DSN = "dsn";
// const ZUKEN = "zuken";
// const KICAD = "kicad";

// export const stepper = {
//   uploadFile: {
//     stepName: "Upload File",
//     stepDetails: "Upload a .dsn file",
//   },
//   checkingBoard: {
//     stepName: "Checking board",
//     stepDetails: "Wait while we check the board",
//   },
//   confirmation: {
//     stepName: "Confirmation",
//     stepDetails: "Confirm the details and pricing",
//   },
// };

// export class OrderPage extends BasePage {
//   private data_folder: string;
//   boardName: string;
//   private typeFile: string;
//   private fileExt: string;
//   private size: string;

//   constructor(page: Page) {
//     super(page);
//     this.baseURL = this.baseURL + "/add-order";
//     this.data_folder = "test-data";
//     this.
//   }

//   async clickOnNewBoardButton() {
//     await this.click(selectors.addNewBoardBtn);
//   }

//   async selectRadioButton(type: string) {
//     this.typeFile = type;
//     switch (type) {
//       case DSN: {
//         this.fileExt = ".dsn";
//         await this.click(selectors.dsnRadioInput);
//         break;
//       }
//       case ZUKEN: {
//         await this.click(selectors.zukenDesignRadioInput);
//         break;
//       }
//       case KICAD: {
//         this.fileExt = ".kicad_pcb";
//         await this.click(selectors.kicadRadioInput);
//         break;
//       }
//     }
//   }

//   async checkNewBoardModalDisplayed() {
//     await this.waitForSelectorToBeVisible(selectors.newBoardDialogTitle);
//   }

//   async clickOnNextButton() {
//     await this.click(selectors.newBoardModalNextBtn);
//   }

//   async verifyNewBoardPageIsDisplayed() {
//     await this.WaitForRedirection(this.baseURL);
//   }

//   async uploadRandomFile(file: string, size: string) {
//     this.boardName = randomString(15);
//     this.size = size;
//     const destinationFilePath = await this.generateFileWithRandomName(
//       file,
//       this.boardName + this.fileExt
//     );
//     let inputFileSelector: string;
//     switch (this.typeFile) {
//       case DSN: {
//         inputFileSelector = selectors.dsnFileInput;
//         break;
//       }
//       case ZUKEN: {
//         inputFileSelector = selectors.zukenDesignFileInput;
//         break;
//       }
//       case KICAD: {
//         inputFileSelector = selectors.kicad_pcbFileInput;
//         break;
//       }
//     }

//     await this.page
//       .locator(inputFileSelector)
//       .setInputFiles(destinationFilePath);
//   }

//   private async generateFileWithRandomName(
//     file: string,
//     boardName: string
//   ): Promise<string> {
//     let destinationFilePath;
//     try {
//       let sourceFilePath = join(this.data_folder, file);
//       destinationFilePath = join(
//         mkdtempSync(join(tmpdir(), "workspace-")),
//         boardName
//       );
//       const data = fs.readFileSync(sourceFilePath, "utf-8");
//       fs.writeFileSync(destinationFilePath, data);
//     } catch (err) {
//       console.error("Error occurred while copying file:", err);
//     }
//     return destinationFilePath;
//   }

//   async verifyFileNameDisplayed() {
//     await this.toHaveText(
//       selectors.uploadedfile,
//       this.boardName + this.fileExt
//     );
//   }

//   async verifySubmitButtonIsEnabled(state: boolean = false) {
//     await this.IsEnabled(state, selectors.newBoardSubmitButton);
//   }

//   async clickOnSubmitButton() {
//     await this.click(selectors.newBoardSubmitButton);
//   }

//   async verifyBoardName() {
//     await this.toHaveText(selectors.newBoardTitle, this.boardName);
//   }

//   async verifyErrorIndicatorIsDisplayed() {
//     await this.waitForSelectorToBeVisible(selectors.errorStatus);
//     await this.waitForSelectorToBeVisible(selectors.errorMsg);
//   }

//   async clickOnUploadBoardCancelButton() {
//     await this.click(selectors.cancelButton);
//   }

//   async verifyNewBoardName() {
//     await this.toHaveValue(selectors.newBoardName, this.boardName);
//   }

//   async verifyNewBoardTitle() {
//     await this.toHaveText(selectors.newBoardTitle, this.boardName);
//   }

//   async checkStepperStep(step: any) {
//     await this.toHaveCSS(selectors.stepperUpload, "color", "rgb(242, 101, 34)");
//     await this.toHaveClass(selectors.stepperIconUpload, /fa-circle-dot/);
//   }

//   async verifyBoardInfo() {
//     // await this.toContainText(selectors.boardInfoNameWithError,this.boardName);
//     // await this.toHaveText(selectors.boardInfoFileNameWithError,this.boardName+this.fileExt);
//     //await this.toHaveText(selectors.)
//   }
// }
