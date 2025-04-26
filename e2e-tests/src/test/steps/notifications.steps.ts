import { When, Then } from "@cucumber/cucumber";
import { Container, ContainerKeys } from "../../containers/container";
import { NotificationPage } from "../../pages/notificationPage";

let notificationPage: NotificationPage;

When("I click on notifications icon", async (): Promise<void> => {
  notificationPage = Container.resolve(ContainerKeys.notificationPage);
  await notificationPage.clickOnNotificationsIcon();
});

Then("The notifications popup is displayed", async (): Promise<void> => {
  await notificationPage.verifyNotificationsPopupDisplayed();
});

When("I click on the settings icon", async (): Promise<void> => {
  await notificationPage.clickOnSettingsIcon();
});

Then("I should be redirected to profile page", async (): Promise<void> => {
  await notificationPage.verifyProfilePageDisplayed();
});

When("I click on clear all button", async (): Promise<void> => {
  await notificationPage.clickOnClearAllButton();
});

Then("All notifications are cleared", async (): Promise<void> => {
  await notificationPage.verifyAllNotificationsCleared();
});

When("I click on close button", async (): Promise<void> => {
  await notificationPage.clickOnCloseButton();
});

Then("The notifications popup is closed", async (): Promise<void> => {
  await notificationPage.verifyNotificationsPopupClosed();
});
