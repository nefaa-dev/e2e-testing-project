import { BasePage } from "./basePage";
import { expect, Page } from "@playwright/test";
import { ToastMessages } from "../helper/constants";
import { Toast } from "./components/toast";

const selectors = {
  profileButton: "div[data-test='show-profile-button']",
  profilePage: "//h1[text()='Profile']",
  firstNameInput: "//div[@data-testid='firstName-input']//input",
  lastnNameInput: "//div[@data-testid='lastName-input']//input",
  alert:
    "//span[contains(text(), 'Name')]/ancestor::div[@class='MuiFormControl-root MuiFormControl-fullWidth css-tzsjye']//div[contains(@class, 'jss') and contains(@class, 'MuiBox-root') and contains(@class, 'css-0') and contains(normalize-space(), 'Required field')]",
  uploadPhotoButton: '//button[@data-test="upload_btn"]',
  deletePhotoButton: "//button[@data-test='delete_btn']",
  profilePhoto: "//img[@alt='avatar']",
  saveButton: "[data-test='general-details-save-button']",
  cancelButton: "[data-test='general-details-cancel-button']",
  firstnameText: "//input[@value='DeepPCB']",
  lastnameText: "//input[@value='Test']",
  firstNameRequiredFieldMessage:
    "//div[@data-test='firstName-input']/following-sibling::p/div[contains(., 'Required field')]",
  lastNameRequiredFieldMessage:
    "//div[@data-test='lastName-input']/following-sibling::p/div[contains(., 'Required field')]",
};

export class ProfilePage extends BasePage {
  private firstName: string;
  private lastName: string;
  private photoSrc: string | null;
  private profileURL: string;
  public toast: Toast;
  private srcPatterns: any;
  constructor(page: Page) {
    super(page);
    this.profileURL = `${this.baseURL}/profile`;
    this.firstName = "";
    this.lastName = "";
    this.toast = new Toast(page);
    this.photoSrc = "";
    this.srcPatterns = {
      known:
        /^https:\/\/storage\.googleapis\.com\/deeppcb-dev-img\/[a-f0-9\-]+\.jpeg(?:\?.*)?$/,
      unknown:
        /^https:\/\/storage\.googleapis\.com\/deeppcb-dev-img\/[a-f0-9\-]+\.png(?:\?.*)?$/,
    };
  }

  async visit() {
    await this.clickOnProfile();
    await this.WaitForRedirection(this.profileURL);
  }

  async clickOnSaveButton() {
    await this.click(selectors.saveButton);
  }

  async clickOnCancel() {
    await this.click(selectors.cancelButton);
  }

  async clickOnProfile() {
    await this.click(selectors.profileButton);
  }

  async checkFirstName(firstName: string) {
    await this.toHaveValue(selectors.firstNameInput, firstName);
  }

  async checkLastName(lastName: string) {
    await this.toHaveValue(selectors.lastnNameInput, lastName);
  }

  async removeFirstName() {
    await this.setFirstName("");
  }

  async removeLastName() {
    await this.setLastName("");
  }

  async setFirstName(firstName: string) {
    await this.fill(selectors.firstNameInput, firstName);
    this.firstName = firstName;
  }

  async setLastName(lastName: string) {
    await this.fill(selectors.lastnNameInput, lastName);
    this.lastName = lastName;
  }

  async getPhotoSrc(): Promise<string | null> {
    const photoLocator = await this.locator(selectors.profilePhoto);
    return await photoLocator.getAttribute("src");
  }

  async uploadPhoto(path: string) {
    this.photoSrc = await this.getPhotoSrc();
    const resolvedFileChooser = await this.waitForFileChooser(
      selectors.uploadPhotoButton
    );
    await resolvedFileChooser.setFiles(path);
  }

  containsGoogleStorageUrl(text: string | null, pattern: RegExp) {
    return pattern.test(text!);
  }

  async checkPhoto() {
    const newPhotoSrc = await this.getPhotoSrc();
    expect(newPhotoSrc).toContain("blob:https://");
    this.photoSrc = newPhotoSrc;
  }

  async photoShouldBeSaved() {
    const currentPhotoSrc = await this.getPhotoSrc();
    expect(
      this.containsGoogleStorageUrl(currentPhotoSrc, this.srcPatterns.known)
    ).toBeTruthy();
  }

  async clickOnDelete() {
    await this.click(selectors.deletePhotoButton);
  }

  async photoShouldBeDeleted() {
    const currentPhotoSrc = await this.getPhotoSrc();
    expect(
      this.containsGoogleStorageUrl(currentPhotoSrc, this.srcPatterns.unknown)
    ).toBeTruthy();
  }

  async updateFullName(firstName: string, lastName: string) {
    await this.setFirstName(firstName);
    await this.setLastName(lastName);
    await this.clickOnSaveButton();
    this.firstName = firstName;
    this.lastName = lastName;
  }

  async verifyFullName() {
    await this.toast.shouldBeVisible(ToastMessages.successSave);
    await this.clickOnCancel();
    await this.clickOnProfile();
    await this.checkFirstName(this.firstName);
    await this.checkLastName(this.lastName);
  }

  async updatePhoto(photo: string) {
    await this.uploadPhoto(photo);
    await this.checkPhoto();
    await this.clickOnSaveButton();
  }

  async verifyPhotoUpdate() {
    await this.toast.shouldBeVisible(ToastMessages.successSave);
    await this.clickOnCancel();
    await this.clickOnProfile();
    await this.photoShouldBeSaved();
  }
  async deletePhoto(photo: string) {
    await this.clickOnDelete();
    await this.checkPhoto();
    await this.clickOnSaveButton();
  }
  async verifyPhotoDeletion() {
    await this.toast.shouldBeVisible(ToastMessages.successSave);
    await this.clickOnCancel();
    await this.clickOnProfile();
    await this.photoShouldBeDeleted();
  }
}
