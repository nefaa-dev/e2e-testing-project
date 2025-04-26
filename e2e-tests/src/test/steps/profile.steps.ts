import { Given, Then, When } from "@cucumber/cucumber";
import { ProfilePage } from "../../pages/profilePage";
import { Container, ContainerKeys } from "../../containers/container";

let profilePage: ProfilePage;

Given("User Is On The Profile Page", async function () {
  profilePage = Container.resolve(ContainerKeys.profilePage);
  await profilePage.visit();
});
When(
  "User updates their {string} and {string}",
  async function (firstName: string, lastName: string) {
    await profilePage.updateFullName(firstName, lastName);
  }
);

Then("Their name should be updated successfully", async function () {
  await profilePage.verifyFullName();
});

When("User updates their {string}", async function (photo: string) {
  await profilePage.updatePhoto(photo);
});

Then("Their photo should be updated successfully", async function () {
  await profilePage.verifyPhotoUpdate();
});

Given("User updated their {string}", async function (photo: string) {
  await profilePage.updatePhoto(photo);
  await profilePage.verifyPhotoUpdate();
});

When("User deletes their {string}", async function (photo: string) {
  await profilePage.deletePhoto(photo);
});

Then("Their photo should be deleted successfully", async function () {
  await profilePage.verifyPhotoDeletion();
});