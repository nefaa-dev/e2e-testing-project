import { Then, When } from "@cucumber/cucumber";
import { LinkPage } from "../../pages/linkPage";
import { Container, ContainerKeys } from "../../containers/container";

let linkPage: LinkPage;

When("User Clicks On {string}", async function (section: string) {
  linkPage = Container.resolve(ContainerKeys.linkPage);
  await linkPage.clickOnSection(section);
});

Then("{string} Page Is Displayed", async function (page: string) {
  await linkPage.verifyPage(page);
});
