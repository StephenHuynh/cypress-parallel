const fs = require('fs');
const { create } = require('xmlbuilder2');

// Get JSON file path from command-line arguments
const jsonFilePath = process.argv[2];

// Check if JSON file path is provided
if (!jsonFilePath) {
   console.error('Usage: node jsonToXml.js <path_to_json_file>');
   process.exit(1);
}

// Read and parse the JSON file
let jsonData;
try {
   const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
   jsonData = JSON.parse(jsonContent);
} catch (err) {
   console.error('Error reading or parsing JSON file:', err.message);
   process.exit(1);
}

// Extract relevant data from the JSON
const { stats, results } = jsonData;

// Create an XML document
const root = create({
   testsuites: {
      '@tests': stats.tests,
      '@failures': stats.failures,
      '@skipped': stats.skipped,
      '@time': stats.duration/1000,
      testsuite: {
         '@name': 'Generic Automated Web Suite',
         testcase: results.map(result => {
            const { file, suites } = result;
            return suites[0].tests.map(test => {
               const { fullTitle, duration, state, err, context } = test;
               const className = file;
               const testName = fullTitle;
               const testTime = duration/1000;

               let testcase = {
                  '@classname': className,
                  '@name': testName,
                  '@time': testTime
               };

               if (state === 'failed') {
                  testcase.failure = {
                     '@message': err.message
                  };
                  // Remove leading and trailing quotes from context value
                  var cleanedContext = context ? context.replace(/^"(.*)"$/, '$1') : '';
                  cleanedContext = cleanedContext.replace("../", "cypress/");
                  testcase.properties = {
                     property: {
                        '@name': 'testrail_attachment',
                        '@value': cleanedContext || ''
                     }
                  };
               } else if (state === 'skipped') {
                  testcase.skipped = {};
               }

               return testcase;
            });
         })
      }
   }
});

// Convert XML document to string
const xmlString = root.end({ prettyPrint: true });

// Write XML string to a file
const outputFilePath = 'cypress/results-merged/xml-output.xml';
fs.writeFileSync(outputFilePath, xmlString);

console.log(`Conversion completed. XML file generated at: ${outputFilePath}`);
