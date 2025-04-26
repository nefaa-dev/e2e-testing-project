import { expect } from "@playwright/test";
import { BasePage } from "./basePage";

const selectors = {
  signBtn: "//a[contains(text(),'Sign up')]",
  signUpPromptMessage:
    "//p[text()='Sign Up to your account to continue to DeepPCB.']",
  emailInput: "id=email",
  passwordInput: "id=password",
  submitBtn: "button[name='action']",
  invalidEmail: "#error-element-email",
  passwordMustContainMessage: "//span[text()='Your password must contain:']",
};

export class SignupPage extends BasePage {
  async clickOnSignup() {
    await this.goTo(this.baseURL);
    await this.click(selectors.signBtn);
  }

  async verifySignUpPageVisible() {
    await this.page.waitForLoadState();
    await this.waitForSelectorToBeVisible(selectors.signUpPromptMessage);
  }

  async clickOnSubmitButton() {
    await this.click(selectors.submitBtn);
  }

  async setEmailAndPassword(email: string, password: string) {
    await this.fill(selectors.emailInput, email);
    await this.fill(selectors.passwordInput, password);
    await this.waitForSelectorToBeVisible(selectors.passwordMustContainMessage);
    await this.clickOnSubmitButton();
  }

  async verifyEmailInputNotValid() {
    await this.toHaveCSS(
      selectors.emailInput,
      "border-color",
      "rgb(208, 14, 23)"
    );

    await this.waitForSelectorToBeVisible(selectors.invalidEmail);
  }

  async verifyPasswordInputNotValid() {
    //await this.toHaveCSS(selectors.passwordInput,'border-color','rgb(208, 14, 23)' );
    await this.waitForSelectorToBeVisible(selectors.passwordMustContainMessage);
  }
}
