import {
  Browser,
  BrowserContext,
  Page,
  chromium,
  firefox,
} from "@playwright/test";
import { Container, ContainerKeys } from "./container";
import { createLogger } from "winston";
import { options } from "../helper/logger";

interface TestContext {
  browserLaunch(): Promise<Browser>;
  newPage(browser: Browser, scenarioName?: String): Promise<Page>;
  close(): Promise<void>;
}

export class ChromiumContext implements TestContext {
  async browserLaunch(): Promise<Browser> {
    let browser = await firefox.launch({
      headless: JSON.parse(process.env.IS_HEADLESS!),
    });

    Container.register("browser", browser);

    return browser;
  }

  private async initContext(
    browser: Browser,
    scenarioName: String
  ): Promise<BrowserContext> {
    let context = await browser.newContext({
      recordVideo: {
        dir: `./artifacts/videos/${scenarioName}`,
      },
    });
    createLogger(options(scenarioName));
    Container.register(ContainerKeys.context, context);
    return context;
  }

  async newPage(browser: Browser, scenarioName?: String): Promise<Page> {
    let page: Page;
    if (scenarioName) {
      let context = await this.initContext(browser, scenarioName);
      page = await context.newPage();
    } else {
      page = await browser.newPage();
    }

    Container.register(ContainerKeys.page, page);
    return page;
  }

  async close(): Promise<void> {
    try {
      if (Container.isRegistered(ContainerKeys.page)) {
        let page: Page = Container.resolve(ContainerKeys.page);

        if (page) {
          await page.close();
        }
      }

      if (Container.isRegistered(ContainerKeys.page)) {
        let context: Page = Container.resolve(ContainerKeys.context);

        if (context) {
          await context.close();
        }
      }

      if (Container.isRegistered(ContainerKeys.browser)) {
        let browser: Browser = Container.resolve(ContainerKeys.browser);
        if (browser) {
          await browser.close();
        }
      }
    } catch (error) {
      console.error("Error during close:", error);
    }
  }
}
