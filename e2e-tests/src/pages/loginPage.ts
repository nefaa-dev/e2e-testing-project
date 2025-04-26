import { expect, Page } from "@playwright/test";
import { BasePage } from "./basePage";

const selectors = {
  usernameInput: "input[inputmode='email']",
  passwordInput: "input[name='password']",
  continueButton: "(//button[text()='Continue'])",
  errorMessage: "id=error-element-password",
  loginPrompt: "//p[text()='Log in to your account to continue to DeepPCB.']",
  wrongEmailCredentialsMessage: "#error-element-password",
};

export class LoginPage extends BasePage {
  protected readonly credentials: any;
  private loginPageUrl: string;
  private authBaseUrl: string;
  constructor(page: Page) {
    super(page);
    this.loginPageUrl = "";
    this.authBaseUrl = process.env.AUTH0_DOMAIN ?? "";
    this.credentials = {
      user: {
        username: process.env.DEEPPCB_USER_USERNAME ?? "",
        password: process.env.DEEPPCB_USER_PASSWORD ?? "",
      },
      admin: {
        username: process.env.DEEPPCB_ADMIN_USERNAME ?? "",
        password: process.env.DEEPPCB_ADMIN_PASSWORD ?? "",
      },
    };
  }

  async goToLoginPage() {
    await this.goTo(this.baseURL);
    await this.waitForSelectorToBeVisible(selectors.continueButton);
    this.loginPageUrl = this.getCurrentUrl();
    expect(this.loginPageUrl).toContain(this.authBaseUrl);
  }

  async verifySuccessfulLogin() {
    await this.WaitForRedirection(this.baseURL);
  }

  async loginShouldFail() {
    const currentUrl = this.getCurrentUrl();
    expect(currentUrl).toBe(this.loginPageUrl);
  }

  async verifyEmailInputIsRequired() {
    await this.waitForSelectorToBeFocused(selectors.usernameInput);
  }

  async signIn(role: string = "user"): Promise<void> {
    switch (role.toLowerCase()) {
      case "user":
        await this.setCredentials(
          this.credentials.user.username,
          this.credentials.user.password
        );
        break;
      case "admin":
        await this.setCredentials(
          this.credentials.admin.username,
          this.credentials.admin.username
        );
        break;
    }
    await this.clickOnContinue();
    await this.verifySuccessfulLogin();
  }

  async setCredentials(username: string, password: string): Promise<void> {
    await this.setUsername(username);
    await this.setPassword(password);
  }

  async setUsername(username: string): Promise<void> {
    await this.fill(selectors.usernameInput, username);
  }

  async setPassword(password: string): Promise<void> {
    let realPassword: string = password;
    if (password.includes("user")) {
      realPassword = this.credentials.user.password;
    } else if (password.includes("admin")) {
      realPassword = this.credentials.admin.password;
    }
    await this.fill(selectors.passwordInput, realPassword);
  }

  async clickOnContinue(): Promise<void> {
    await this.click(selectors.continueButton);
  }
}
