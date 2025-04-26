import { config } from "../../playwright.config";

const defaultBaseURL: string = "http://127.0.0.1:3000";
const baseURL: string = config.use?.baseURL ?? defaultBaseURL;

export const URLs: Record<string, string> = {
  profile: `${baseURL}/profile`,
  policies: "https://deeppcb.ai/privacy/",
  help: "https://deeppcb.ai/help/",
  contactUs: "https://deeppcb.ai/contact",
};

export const ToastMessages = {
  successSave: "Changes saved successfully.",
};

export const Endpoints = {
  boards: "/api/v1/user/boards",
};

export const Regexes = {
  boardDefault: /\/api\/v1\/boards\/[a-f0-9\-]{36}\/board-default-definition/,
  diffPairs: /\/api\/v1\/differentialpairs\/[a-f0-9\-]{36}/,
  nets: /\/api\/v1\/nets\/[a-f0-9\-]{36}/,
  layers: /\/api\/v1\/layers\/[a-f0-9\-]{36}/,
  boardMetrics: /\/api\/v1\/boards\/[a-f0-9\-]{36}\/board-metrics/,
};
