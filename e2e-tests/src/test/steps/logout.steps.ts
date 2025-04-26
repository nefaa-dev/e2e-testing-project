import { Given, Then, When } from "@cucumber/cucumber";
import { Container, ContainerKeys } from "../../containers/container";
import { LogoutPage } from "../../pages/logoutPage";
import { ProfilePage } from "../../pages/profilePage";

let logoutPage: LogoutPage;

Given("User is in profile page", async function () {
  let profilePage: ProfilePage = Container.resolve(ContainerKeys.profilePage);
  await profilePage.visit();
});

When("User clicks on logout button", async function () {
  logoutPage = Container.resolve(ContainerKeys.logoutPage);
  await logoutPage.clickOnLogoutButton();
});

Then("User should be logged out", async function () {
  await logoutPage.verifyLoginPromptIsVisible();
});
