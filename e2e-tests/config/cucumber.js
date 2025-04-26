module.exports = {
    default: {
        tags: process.env.npm_config_TAGS || "",
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
            "src/tests/features/"
        ],
        retry: 1,
        publishQuiet: true,
        dryRun: false,
        require: [
            "src/tests/steps/*.ts",
            "src/hooks/hooks.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            "progress",
            "html:tests-results/cucumber-report.html",
            "json:tests-results/cucumber-report.json",
            "junit:tests-results/cucumber-report.xml",
            "rerun:@rerun.txt"
        ],
        parallel: 1
    },
    rerun: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        retry: 1,
        publishQuiet: true,
        dryRun: false,
        require: [
            "src/tests/steps/*.ts",
            "src/hooks/hooks.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            "progress",
            "html:tests-results/cucumber-report.html",
            "json:tests-results/cucumber-report.json",
            "junit:tests-results/cucumber-report.xml",
            "rerun:@rerun.txt"
        ],
        parallel: 2
    }
}


//https://gitlab.com/instadeep/deeppcb/anakin/-/issues/470