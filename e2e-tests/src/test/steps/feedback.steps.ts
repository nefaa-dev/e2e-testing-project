import {Then, When} from "@cucumber/cucumber";
import {Container, ContainerKeys} from "../../containers/container";
import {FeedbackPage} from "../../pages/feedbackPage";

let feedbackPage : FeedbackPage;

When('I click on share feedback button', async function () {
    feedbackPage = Container.resolve(ContainerKeys.feedbackPage);
    await feedbackPage.clickOnShareFeedbackButton();
});

Then('The feedback popup is displayed', async function () {
    await feedbackPage.verifyFeedbackPopupDisplayed();
});

When("I click on choose an area dropdown button", async (): Promise<void> => {
    await feedbackPage.clickOnChooseAreaDropdown();
});

Then("Three options are displayed, user experience, customer support and pricing", async (): Promise<void> => {
    await feedbackPage.verifyAreasDisplayed();
});
When('I fill the feedback form with valid {string} and {string} and {string}', async (area: string, file: string, details: string) => {
    const areaNum = parseInt(area);
    const fileBool = file.toLowerCase() === 'true';
    await feedbackPage.fillFeedbackForm(areaNum, details, fileBool);
  });

  


When("I click on submit button", async (): Promise<void> => {
    await feedbackPage.clickOnSubmitButton();
});

Then("The feedback is submitted", async (): Promise<void> => {
    await feedbackPage.verifyFeedbackSubmitted();
});

When("I click on Cancel feedback modal button", async (): Promise<void> => {
    await feedbackPage.clickOnCancelFeedbackButton();
});

Then("verify the feedback modal is closed", async (): Promise<void> => {
    await feedbackPage.verifyFeedbackPopupNotDisplayed();
});

Then("the button submit is disabled", async (): Promise<void> => {
    await feedbackPage.verifySubmitButtonDisabled();
});

