import { BasePage } from "./basePage";

const selectors = {
  notificationsIcon: "[data-test='show-notifications-button']",
  notificationsListTitle: "[data-test='notifications-list-title']",
  notificationsListSettingsIcon: "[data-test='notifications-list-slider']",
  notificationsListCloseIcon: "[data-test='notifications-list-close-button']",
  notificationListFirstItem:
    "(//*[starts-with(@data-test, 'notification-item-title-')])[1]",
  clearAllButton: "//div[@data-test='notifications-list-clear']/h5",
};

export class NotificationPage extends BasePage {
  async clickOnNotificationsIcon(): Promise<void> {
    await this.click(selectors.notificationsIcon);
  }

  async verifyNotificationsPopupDisplayed(): Promise<void> {
    await this.waitForSelectorToBeVisible(selectors.notificationsListTitle);
  }

  async clickOnSettingsIcon(): Promise<void> {
    await this.click(selectors.notificationsListSettingsIcon);
  }

  async verifyProfilePageDisplayed(): Promise<void> {
    await this.WaitForRedirection(`${this.baseURL}/profile`);
  }

  async clickOnClearAllButton(): Promise<void> {
    await this.click(selectors.clearAllButton);
  }

  async verifyAllNotificationsCleared(): Promise<void> {
    await this.waitForSelectorNotToBeVisible(
      selectors.notificationListFirstItem
    );
  }

  async clickOnCloseButton(): Promise<void> {
    await this.click(selectors.notificationsListCloseIcon);
  }

  async verifyNotificationsPopupClosed(): Promise<void> {
    await this.waitForSelectorNotToBeVisible(selectors.notificationsListTitle);
  }
}
