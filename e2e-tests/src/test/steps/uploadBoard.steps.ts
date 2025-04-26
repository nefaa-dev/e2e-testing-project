import { Given, When, Then } from "@cucumber/cucumber";
import { Container, ContainerKeys } from "../../containers/container";
import { AddOrderPage } from "../../pages/addOrderPage";

let addOrderPage: AddOrderPage;

When(
  "User uploads {string}, {string} and {string} using {string}",
  async (
    firstReqFile: string,
    secondReqFile: string,
    optionalFile: string,
    strategy: string
  ): Promise<void> => {
    addOrderPage = Container.resolve(ContainerKeys.addOrderPage);
    await addOrderPage.uploadBoard(
      firstReqFile,
      secondReqFile,
      optionalFile,
      strategy
    );
  }
);

When("The board should be uploaded", async function () {
  await addOrderPage.verifyBoardUpload();
});

Given(
  "User already uploaded a board using {string}, {string} and {string} for {string}",
  async function (
    firstReqFile: string,
    secondReqFile: string,
    optionalFile: string,
    strategy: string
  ) {
    addOrderPage = Container.resolve(ContainerKeys.addOrderPage);
    await addOrderPage.uploadBoard(
      firstReqFile,
      secondReqFile,
      optionalFile,
      strategy
    );
    await addOrderPage.verifyBoardUpload();
  }
);

When("User submit the board", async function () {
  await addOrderPage.submitBoard();
});

Then("the board should be submitted", async function () {
  await addOrderPage.verifyBoardSubmit();
});

Then("the board should be checked successfully", async function () {
  await addOrderPage.verifyBoardCheck();
});

Then("the board should be set up successfully", async function () {
  await addOrderPage.verifyBoardSetUp();
});
