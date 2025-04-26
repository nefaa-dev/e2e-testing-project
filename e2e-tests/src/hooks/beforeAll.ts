import * as dotenv from "dotenv";
import { LoginPage } from "../pages/loginPage";
import { Page } from "playwright";
import { BrowserTestContext } from "../containers/test_context";
import { generateTimeStamp } from "../helper/tools";
dotenv.config();

let browser;
let testContext: BrowserTestContext;
let loginPage: LoginPage;

async function startBrowser(webUrl: string) {
  if (!webUrl) {
    throw new Error(
      "WEB_URL is not defined. Please set the environment variable in the .env file."
    );
  }

  testContext = new BrowserTestContext();
  browser = await testContext.browserLaunch();
  return await testContext.newPage(browser, `beforeAll_${generateTimeStamp()}`);
}

async function beforeAll(page: Page, webUrl: string) {
  loginPage = new LoginPage(page);
  await loginPage.goToLoginPage(webUrl);
  await loginPage.signIn();
  await page.context().storageState({ path: "auth.json" });
}

async function closeBrowser() {
  if (testContext) {
    await testContext.close();
    console.log("Browser closed");
  }
}

async function runWithRetries(maxRetries: number = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt} of ${maxRetries}`);
    try {
      const webUrl = process.env.WEB_URL ?? "";
      browser = await startBrowser(webUrl);
      await beforeAll(browser, webUrl);
      await closeBrowser();
      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed with error: ${error}`);
      if (attempt === maxRetries) {
        console.error("All retry attempts failed.");
        throw error;
      } else {
        console.log("Retrying...");
      }
    }
  }
}

(async () => {
  await runWithRetries();
})();
