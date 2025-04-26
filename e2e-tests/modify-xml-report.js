const fs = require('fs');
const xml2js = require("xml2js");
const parseString = require('xml2js').parseString;
const builder = require('xml2js').Builder;

const xmlFilePath = 'test-results/cucumber-report.xml';

const projectDir = process.env.CI_PROJECT_DIR;
const namespace = process.env.CI_PROJECT_NAMESPACE;
const projectName = process.env.CI_PROJECT_NAME;
const jobId = process.env.CI_JOB_ID;
const author = process.env.CI_COMMIT_AUTHOR;

console.log('projectDir: ', projectDir);
console.log('namespace: ', namespace);
console.log('projectName: ', projectName);
console.log('jobId: ', jobId);

function modifyXML(xmlContent) {
    parseString(xmlContent, (err, result) => {
        if (err) {
            console.error('Error parsing the XML:', err);
            return;
        }

        const testcases = result.testsuite.testcase;

        for (const testcase of testcases) {
            const testName = testcase.$.name;
            const steps = testcase['system-out'][0].split('\n').filter(step => step.trim() !== '');

            const properties = {
                property: steps.map(step => ({
                    '$': {
                        name: `step[${step.includes('failed') ? 'failure' : step.includes('skipped') ? 'skipped' : 'passed'}]`,
                        value: step.replace(/^\S+\s/, '').replace(/\.{3,}.*$/, '.'), // Simplify step name
                    }
                }))
            };

            if (testcase.failure) {
                const attachmentLink = `[[ATTACHMENT|/components/e2e-tests/screenshots/${testName}.png]]`;
                const testMoAttachmentLink = `https://gitlab.com/${namespace}/${projectName}/-/jobs/${jobId}/artifacts/file/components/e2e-tests/screenshots/${encodeURIComponent(testName)}.png`;
                testcase['system-out'][0] = `${attachmentLink}\n${testcase['system-out'][0]}`;
                properties.property.push({ '$': { name: 'url:screenshot', value: testMoAttachmentLink } });
                properties.property.push({ '$': { name: 'attachment', value: testMoAttachmentLink } });
                properties.property.push({ '$': { name: 'Author', value: author } });
            }

            testcase.properties = properties;
        }

        const xmlBuilder = new builder();
        const modifiedXML = xmlBuilder.buildObject(result);

        fs.writeFile(xmlFilePath, modifiedXML, 'utf8', (err) => {
            if (err) {
                console.error('Error writing the modified XML file:', err);
                return;
            }

            console.log('XML file successfully modified.');
        });
    });

    const xml2js = require('xml2js');

    const inputFile = 'test-results/cucumber-report.xml';
    const outputFile = 'test-results/testmo-report.xml';

// Read the XML file
    fs.readFile(inputFile, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading the XML file:', err);
            return;
        }

        // Parse XML to JavaScript object
        xml2js.parseString(data, (parseErr, result) => {
            if (parseErr) {
                console.error('Error parsing XML:', parseErr);
                return;
            }

            // Remove system-out tags and their content
            traverseAndRemoveSystemOut(result);

            // Convert modified object back to XML
            const builder = new xml2js.Builder();
            const modifiedXml = builder.buildObject(result);

            // Write modified XML content to a new file
            setTimeout(() => {
            fs.writeFile(outputFile, modifiedXml, (writeErr) => {
                if (writeErr) {
                    console.error('Error writing the modified XML to a file:', writeErr);
                } else {
                    console.log('Modified XML saved to', outputFile);
                }
            });
            }, 3000);
        });
    });

    function traverseAndRemoveSystemOut(obj) {
        if (obj instanceof Array) {
            for (let i in obj) {
                traverseAndRemoveSystemOut(obj[i]);
            }
        } else if (typeof obj === 'object') {
            for (let prop in obj) {
                if (prop === 'system-out') {
                    delete obj[prop];
                } else {
                    traverseAndRemoveSystemOut(obj[prop]);
                }
            }
        }
    }
}

fs.readFile(xmlFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the XML file:', err);
        return;
    }

    modifyXML(data);
});
