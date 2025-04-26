import { Browser, Page } from "@playwright/test";
import { Before, After, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { ChromiumContext } from "../containers/test_context";
import { LoginPage } from "../pages/loginPage";
import { LogoutPage } from "../pages/logoutPage";
import { ProfilePage } from "../pages/profilePage";
import { NotificationPage } from "../pages/notificationPage";
import { AddOrderPage } from "../pages/addOrderPage";
import { FeedbackPage } from "../pages/feedbackPage";
import { LinkPage } from "../pages/linkPage";
import { SignupPage } from "../pages/signupPage";
import { Container, ContainerKeys } from "../containers/container";
import config from "../../playwright.config";
import { captureScreenshots } from "../helper/tools";

export const globalTimeout: number = config.expect?.timeout!;
setDefaultTimeout(globalTimeout);
let browser: Browser;

let page: Page;
let testContext: any;
let signupPage: SignupPage;
let loginPage: LoginPage;
let logoutPage: LogoutPage;
let profilePage: ProfilePage;
let notificationPage: NotificationPage;
let addOrderPage: AddOrderPage;
let feedbackPage: FeedbackPage;
let linkPage: LinkPage;

const fs = require("fs");

Before(async (scenario: any) => {
  testContext = new ChromiumContext();
  browser = await testContext.browserLaunch();
  page = await testContext.newPage(browser, scenario.pickle.name);

  const tags = scenario.pickle.tags.map((tag: any) => tag.name);

  signupPage = new SignupPage(page);
  loginPage = new LoginPage(page);
  logoutPage = new LogoutPage(page);
  profilePage = new ProfilePage(page);
  notificationPage = new NotificationPage(page);
  addOrderPage = new AddOrderPage(page);
  feedbackPage = new FeedbackPage(page);
  linkPage = new LinkPage(page);

  Container.register(ContainerKeys.signupPage, signupPage);
  Container.register(ContainerKeys.loginPage, loginPage);
  Container.register(ContainerKeys.logoutPage, logoutPage);
  Container.register(ContainerKeys.profilePage, profilePage);
  Container.register(ContainerKeys.notificationPage, notificationPage);
  Container.register(ContainerKeys.addOrderPage, addOrderPage);
  Container.register(ContainerKeys.feedbackPage, feedbackPage);
  Container.register(ContainerKeys.linkPage, linkPage);

  await loginPage.goToLoginPage();
  const isSignInNeeded = !tags.includes("@login") && !tags.includes("@signup");
  if (isSignInNeeded) {
    await loginPage.signIn();
  }
});

After(async function (scenario: any) {
  await captureScreenshots(scenario, page);
  await testContext.close();
  Container.clearAll();
});
