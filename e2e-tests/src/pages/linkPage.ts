import { expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { URLs } from "../helper/constants";

const selectors = {
  contactUsButton: "//div[@data-test='contact-us-menu-button']",
  helpButton: "//div[@data-test='faq-menu-button']",
  deeppcbPoliciesButton: "//div[@data-test='deep-pcb-policies-menu-button']",
};
export class LinkPage extends BasePage {
  private readonly pagesMap: Record<string, string> = {
    contact: selectors.contactUsButton,
    help: selectors.helpButton,
    policies: selectors.deeppcbPoliciesButton,
  };

  async clickOnSection(section: string) {
    const sectionSelector = this.pagesMap[section];
    if (!sectionSelector) {
      throw new Error(`Unknown section: ${section}`);
    }
    await this.click(sectionSelector);
  }

  async verifyPage(page: string): Promise<void> {
    const buttonSelector = this.pagesMap[page];
    if (!buttonSelector) {
      throw new Error(`Unknown page: ${page}`);
    }
    const returnedPage = await this.waitForPopup(buttonSelector);
    await expect(returnedPage).toHaveURL(URLs[page]);
    await returnedPage.close();
  }
}
