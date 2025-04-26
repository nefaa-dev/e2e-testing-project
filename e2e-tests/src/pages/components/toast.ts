import { BasePage } from "../basePage";

export class Toast extends BasePage {
  async shouldBeVisible(message: string) {
    const toastSelector = `//h5[text()='${message}']`;
    await this.waitForSelectorToBeVisible(toastSelector);
  }
}
