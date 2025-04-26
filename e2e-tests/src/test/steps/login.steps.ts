import { Given, Then } from "@cucumber/cucumber";
import { LoginPage } from "../../pages/loginPage";
import { Container, ContainerKeys } from "../../containers/container";

let loginPage: LoginPage;

Given("User navigates to the Deep-PCB website", async function () {
  loginPage = Container.resolve(ContainerKeys.loginPage);
  await loginPage.goToLoginPage();
});

Then("Login Should Be Success", async function () {
  await loginPage.verifySuccessfulLogin();
});

Given("User Enters Username As {string}", async function (username: string) {
  await loginPage.setUsername(username);
});

Given("User Enters Password As {string}", async function (password: string) {
  await loginPage.setPassword(password);
});

Given("User Clicks On Continue Button", async function () {
  await loginPage.clickOnContinue();
});

Then("Login Should Fail", async function () {
  await loginPage.loginShouldFail();
});

Given("User Is Signed In As {string}", async function (role: string) {
  loginPage = Container.resolve(ContainerKeys.loginPage);
  await loginPage.signIn(role);
});
