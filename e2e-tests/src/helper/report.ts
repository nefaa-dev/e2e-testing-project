const report = require("multiple-cucumber-html-reporter");

report.generate({
    jsonDir: "test-results",
    reportPath: "./",
    reportName: "Project Name Automation Report",
    pageTitle: "Project Name Automation Report",
    displayDuration: "false",
    metadata: {
        browser: {
            name: "chrome",
            version: "112",
        },
        device: "InstaDeep test machine",
        platform: {
            name: "Windows",
            version: "10",
        },
    },
    customData: {
        title: "Run info",
        data: [
            { label: "Project", value: "Project Name" },
            { label: "Release", value: "Version" }
        ],
    },
});
