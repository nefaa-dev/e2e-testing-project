import { BasePage } from "./basePage";

const selectors = {
  shareFeedbackButton: "//button[text()='Share Feedback']",
  shareFeedbackModalTitle: "[data-test='share-feedback-modal-title']",
  chooseAreaDropdown: "[data-test='Choose an area']",
  detailsTextarea:
    "//div[@data-test='feedback-modal-details-textarea']//textarea[not(contains(@style, 'visibility: hidden'))]",
  attachFileInput:
    "//button[@data-test='share-feedback-attach-file']/preceding-sibling::input",
  feedbackModalCancelButton: "[data-test='feedback-modal-cancel-button']",
  feedbackModalSubmitButton: "[data-test='feedback-modal-submit-button']",
  closeModalButton: "[data-test='close-modal-button']",
  feedbackSubmittedMessage: "[data-test='submit-feedback-success']",
};

export class FeedbackPage extends BasePage {
  areas: string[] = ["User Experience", "Customer Support", "Pricing"];

  async clickOnShareFeedbackButton(): Promise<void> {
    await this.click(selectors.shareFeedbackButton);
  }

  async verifyFeedbackPopupDisplayed(): Promise<void> {
    await this.waitForSelectorToBeVisible(selectors.shareFeedbackModalTitle);
  }

  async clickOnChooseAreaDropdown(): Promise<void> {
    await this.click(selectors.chooseAreaDropdown);
  }

  async verifyAreasDisplayed(): Promise<void> {
    for (const area of this.areas) {
      const locator = `[data-test='${area}']`;
      await this.waitForSelectorToBeVisible(locator);
      await this.toHaveText(locator, area);
    }
  }

  async fillFeedbackForm(
    areaId: number,
    details: string,
    file: boolean
  ): Promise<void> {
    await this.click(`[data-test='${this.areas[areaId]}']`);
    await this.waitForSelectorToBeVisible(
      `//div[@data-test='Choose an area']//div[text() = '${this.areas[areaId]}']`
    );
    await this.fill(selectors.detailsTextarea, details);
    if (file)
      await this.page.setInputFiles(
        selectors.attachFileInput,
        "test-data/test_attach.png"
      );
  }

  async verifyFeedbackSubmitted(): Promise<void> {
    await this.waitForSelectorToBeVisible(selectors.feedbackSubmittedMessage);
  }

  async verifyFeedbackPopupNotDisplayed() {
    await this.waitForSelectorNotToBeVisible(selectors.shareFeedbackModalTitle);
  }

  async clickOnCancelFeedbackButton() {
    await this.click(selectors.feedbackModalCancelButton);
  }

  async clickOnSubmitButton(): Promise<void> {
    await this.click(selectors.feedbackModalSubmitButton);
  }

  async verifySubmitButtonDisabled() {
    await this.IsEnabled(false, selectors.feedbackModalSubmitButton);
  }
}
