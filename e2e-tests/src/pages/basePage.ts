import { expect, FileChooser, Locator, Page } from "@playwright/test";
import config from "../../playwright.config";
import { error } from "console";

export class BasePage {
  protected page: Page;
  public baseURL: string;
  protected baseApiURL: string;
  protected timeout: number;
  public elementStates: any;
  constructor(page: Page) {
    this.page = page;
    this.baseURL = config.use?.baseURL || "http://127.0.0.1:3000";
    this.timeout = config.expect?.timeout! / 2; // 30s
    this.baseApiURL = `${this.baseURL.replace("https://", "https://api.")}`;
    this.elementStates = {
      visible: "visible",
      detached: "detached",
      attached: "attached",
      hidden: "hidden",
      checked: "checked",
      unchecked: "unchecked",
      disabled: "disabled",
    };
  }

  async goTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async WaitForRedirection(url: string): Promise<void> {
    await this.page.waitForURL(url, { timeout: this.timeout });
    await expect(this.page).toHaveURL(url, { timeout: this.timeout * 2 });
  }

  async getNumberOfSelectorElements(elementSelector: string): Promise<number> {
    return await this.page.locator(elementSelector).count();
  }

  async toHaveValue(elementSelector: string, value: any): Promise<void> {
    await this.waitForSelectorToBeVisible(elementSelector);
    await expect(this.page.locator(elementSelector)).toHaveValue(value, {
      timeout: this.timeout,
    });
  }

  async toNotHaveValue(elementSelector: string, value: any): Promise<void> {
    await this.waitForSelectorToBeVisible(elementSelector);
    await expect(this.page.locator(elementSelector)).not.toHaveValue(value, {
      timeout: this.timeout,
    });
  }

  async toContainText(elementSelector: string, value: any): Promise<void> {
    await this.waitForSelectorToBeVisible(elementSelector);
    await expect(this.page.locator(elementSelector)).toContainText(value, {
      timeout: this.timeout,
    });
  }

  async toHaveCSS(
    elementSelector: string,
    property: any,
    value: any
  ): Promise<void> {
    await this.waitForSelectorToBeVisible(elementSelector);

    await expect(this.page.locator(elementSelector)).toHaveCSS(
      property,
      value,
      { timeout: this.timeout }
    );
  }

  async toHaveClass(elementSelector: string, value: any): Promise<void> {
    await this.waitForSelectorToBeVisible(elementSelector);

    await expect(this.page.locator(elementSelector)).toHaveClass(value, {
      timeout: this.timeout,
    });
  }

  async toHaveText(elementSelector: string, value: string): Promise<void> {
    await this.waitForSelectorToBeVisible(elementSelector);
    await expect(this.page.locator(elementSelector)).toHaveText(value, {
      timeout: this.timeout,
    });
  }

  async elementShouldBe({
    selector,
    status = this.elementStates.visible,
    baseLocator = null,
  }: {
    selector: string;
    status?: string;
    baseLocator?: Locator | null;
  }): Promise<void> {
    const elementLocator: Locator = baseLocator
      ? baseLocator.locator(selector)
      : this.page.locator(selector);

    switch (status) {
      case this.elementStates.hidden:
        await expect(elementLocator).toBeHidden();
        break;
      case this.elementStates.checked:
        await expect(elementLocator).toBeChecked();
        break;
      case this.elementStates.enabled:
        await expect(elementLocator).toBeEnabled();
        break;
      case this.elementStates.disabled:
        await expect(elementLocator).toBeDisabled();
        break;
      default:
        throw new Error(`Unknown column status: ${status}`);
    }
  }

  async click(elementSelector: string): Promise<void> {
    const elementLocator = await this.locator(elementSelector);
    await elementLocator.waitFor();
    await elementLocator.click();
  }

  async fill(elementSelector: string, value: string): Promise<void> {
    await this.waitForSelectorToBeVisible(elementSelector);
    await this.page.fill(elementSelector, value, { timeout: this.timeout });
  }

  async select(elementSelector: string, optionValue: any): Promise<void> {
    await this.waitForSelectorToBeVisible(elementSelector);
    if (typeof optionValue === "number") {
      await this.page
        .locator(elementSelector)
        .selectOption({ index: optionValue });
    } else {
      await this.page
        .locator(elementSelector)
        .selectOption({ value: optionValue });
    }
  }

  async getValue(selector: string) {
    const elementLocator = await this.locator(selector);
    return await elementLocator.getAttribute("value");
  }

  async waitForSelectorToBeVisible(elementSelector: string): Promise<void> {
    await expect(this.page.locator(elementSelector)).toBeVisible({
      timeout: this.timeout,
    });
  }

  async waitForSelectorNotToBeVisible(elementSelector: string): Promise<void> {
    await expect(this.page.locator(elementSelector)).not.toBeVisible({
      timeout: this.timeout,
    });
  }

  async waitForResponse(url: string | ((res: any) => boolean)): Promise<void> {
    await this.page.waitForResponse(url, { timeout: this.timeout });
  }

  async checkCheckboxStatus(status: boolean, checkbox: Locator): Promise<void> {
    if (status) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  async IsEnabled(status: boolean, elementSelector: string): Promise<void> {
    if (status) {
      await expect(this.page.locator(elementSelector)).toBeEnabled();
    } else {
      await expect(this.page.locator(elementSelector)).not.toBeEnabled();
    }
  }

  async waitForSelectorToBeFocused(elementSelector: string): Promise<void> {
    await expect(this.page.locator(elementSelector)).toBeFocused({
      timeout: this.timeout,
    });
  }

  async reloadPage() {
    await this.page.reload();
  }

  async waitUntilPass(
    expectation: () => Promise<void>,
    maxAttempts: number = 150,
    delayMs: number = 100
  ): Promise<void> {
    let attempts: number = 0;
    let error: Error | undefined;
    while (attempts < maxAttempts) {
      try {
        await expectation();
        return; // Expectation passed, exit the loop
      } catch (e) {
        error = e as Error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs)); // Wait for the specified delay
      attempts++;
    }
    throw error; // Expectation failed even after retries, throw the last error
  }

  async locator(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  async waitForPopup(elementSelector: string): Promise<Page> {
    const eventPromise = this.page.waitForEvent("popup");
    const elementLocator = await this.locator(elementSelector);
    await elementLocator.click();
    return await eventPromise;
  }

  async waitForFileChooser(elementSelector: string): Promise<FileChooser> {
    const eventPromise = this.page.waitForEvent("filechooser");
    const elementLocator = await this.locator(elementSelector);
    await elementLocator.click();
    return await eventPromise;
  }
}
