import { BasePage } from "./basePage";

const selectors = {
  loginPrompt: "//p[text()='Log in to your account to continue to DeepPCB.']",
  logoutBtn: "//button[@data-test='sidebar-general-logout-button']",
};

export class LogoutPage extends BasePage {
  async clickOnLogoutButton() {
    await this.click(selectors.logoutBtn);
  }

  async verifyLoginPromptIsVisible() {
    await this.waitForSelectorToBeVisible(selectors.loginPrompt);
  }
}
