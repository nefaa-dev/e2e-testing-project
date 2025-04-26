import { expect, Locator, Page } from "playwright/test";
import { Container, ContainerKeys } from "../../containers/container";
export class TableTemplate {
  private tableLocator: Locator;
  private headerLocator: Locator;
  private rowLocator: Locator;

  public headers: string[] = [];
  public rows: string[][] = [];
  public expectedHeaders: string[] = [];
  public expectedRows: string[][] = [];

  private constructor(tableLocator: Locator, headers: string[]) {
    this.tableLocator = tableLocator;
    this.headerLocator = this.tableLocator.locator("thead tr th");
    this.rowLocator = this.tableLocator.locator("tbody tr");
    this.expectedHeaders = headers;
  }

  public static getInstance(
    tableLocator: Locator,
    headers: string[]
  ): TableTemplate {
    let table: TableTemplate;
    if (!Container.isRegistered(ContainerKeys.tableTemplate)) {
      table = new TableTemplate(tableLocator, headers);
      Container.register(ContainerKeys.tableTemplate, table);
    } else {
      table = Container.resolve(ContainerKeys.tableTemplate);
    }
    return table;
  }

  public async getHeaders() {
    const count = await this.headerLocator.count();
    for (let i = 0; i < count; i++) {
      const text = await this.headerLocator.nth(i).innerText();
      this.headers.push(text.trim().replace(/\s+/g, " "));
    }
  }

  public async getRows() {
    const rowCount = await this.rowLocator.count();
    for (let i = 0; i < rowCount; i++) {
      const row = this.rowLocator.nth(i);
      const cells = row.locator("td");
      const cellValues = (await cells.allInnerTexts()).map((text) =>
        text.trim().replace(/\s+/g, " ")
      );
      this.rows.push(cellValues);
    }
  }

  public async loadTableData() {
    await this.getHeaders();
    await this.getRows();
  }

  public setHeaders(expected: string[]) {
    this.expectedHeaders = expected;
  }

  public setRows(expected: string[][]) {
    this.expectedRows = expected;
  }

  public assertHeaders(expected: string[]) {
    expect(this.headers).toEqual(expected);
  }

  public assertRows(expected: string[][]) {
    expect(this.rows).toEqual(expected);
  }

  public assertCell(rowIndex: number, colIndex: number, expected: string) {
    expect(this.rows[rowIndex][colIndex]).toBe(expected);
  }
}
