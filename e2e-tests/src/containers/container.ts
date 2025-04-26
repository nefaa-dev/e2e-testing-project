export const ContainerKeys = {
  browser: "browser",
  context: "context",
  page: "page",
  loginPage: "loginPage",
  logoutPage: "logoutPage",
  profilePage: "profilePage",
  notificationPage: "notificationPage",
  addOrderPage: "boardPage",
  feedbackPage: "feedbackPage",
  linkPage: "linkPage",
  orderPage: "orderPage",
  signupPage: "signupPage",
  tableTemplate: "tableTemplate",
} as const;

export class Container {
  public static dependencies: { [key: string]: any } = {};

  static register(name: string, dependency: any): void {
    Container.dependencies[name] = dependency;
  }

  static resolve<T>(name: string): T {
    if (!(name in Container.dependencies)) {
      throw new Error(`Dependency not found: ${name}`);
    }

    return Container.dependencies[name];
  }

  static remove(name: string): void {
    if (!(name in Container.dependencies)) {
      throw new Error(`Dependency not found: ${name}`);
    }

    delete Container.dependencies[name];
  }

  static registerSequenceArray(name: string, sequences: string[]): void {
    Container.dependencies[name] = sequences;
  }

  static resolveSequenceArray(name: string): string[] {
    if (!(name in Container.dependencies)) {
      throw new Error(`Dependency not found: ${name}`);
    }

    return Container.dependencies[name];
  }

  static isRegistered(name: string): boolean {
    return name in Container.dependencies;
  }

  static clearAll() {
    Object.keys(Container.dependencies).forEach((key: string) => {
      delete Container.dependencies[key];
    });
  }
}
