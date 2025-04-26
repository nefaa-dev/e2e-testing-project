import { Given, When } from "@cucumber/cucumber";
import { Container, ContainerKeys } from "../../containers/container";
import { AddOrderPage } from "../../pages/addOrderPage";

let addOrderPage: AddOrderPage;
When("User check {string}", async (constraint: string) => {
  addOrderPage = Container.resolve(ContainerKeys.addOrderPage);
  await addOrderPage.checkConstraints(constraint);
});

When(
  "{string} should be as expected {string}",
  async (constraint: string, constraintsFile: string) => {
    await addOrderPage.verifyConstraints(constraint, constraintsFile);
  }
);

Given("Net classes were checked successfully", async () => {
  addOrderPage = Container.resolve(ContainerKeys.addOrderPage);
  await addOrderPage.netClassesShouldBeSuccess();
});
