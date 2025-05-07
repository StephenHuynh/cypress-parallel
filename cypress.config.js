const { defineConfig } = require('cypress');
const { cloudPlugin } = require("cypress-cloud/plugin");

module.exports = defineConfig({
    e2e: {
        "experimentalMemoryManagement": true,
        "viewportHeight": 1000,
        "viewportWidth": 1680,
        "excludeSpecPattern": ["*.page.js", "utils.js", "*.d.ts"],
        "defaultCommandTimeout": 10000,
        "video": false,
        "pageLoadTimeout": 120000,
        "specPattern": [
            "cypress/e2e/*.js",
        ],
        "env": {
            "grepFilterSpecs": true,
            "grepOmitFiltered": true,
            "envValue": "noriaDev",
            "api": {
                "baseEndpoint": `${process.env.BASE_ENDPOINT}`,
                "authEndpoint": `${process.env.BASE_ENDPOINT}/auth/euk/token`,
            }
        },

        setupNodeEvents(on, config) {
            const envConfig = require(`./${config.env.envValue}.env.json`);
            const buildId = process.env.BUILD || "local";
            const machine = process.env.COMPUTERNAME;
            const reporterConfig = {
                "reporter": "mochawesome",
                "reporterOptions": {
                    "useInlineDiffs": true,
                    "embeddedScreenshots": true,
                    "reportDir": "cypress/results",
                    "reportFilename": `${buildId}_${machine}_${config.env.envValue}_[name]`,
                    "overwrite": true,
                    "html": true,
                    "json": true
                }
            };

            // Increase the browser window size when running headlessly
            // this will produce higher resolution images and videos
            // reference: https://on.cypress.io/browser-launch-api
            on('before:browser:launch', (browser = {}, launchOptions) => {
                console.log(
                    'Launching browser %s is headless? %s',
                    browser.name,
                    browser.isHeadless,
                )

                // the browser width and height we want to get
                // our screenshots and videos will be of that resolution
                const width = 1920
                const height = 1080
                // 4k resolution 
                //const width = 3840
                //const height = 2160
                console.log('Setting the browser window size to %d x %d', width, height)

                if (browser.name === 'chrome' && browser.isHeadless) {
                    launchOptions.args.push(`--window-size=${width},${height}`)

                    // force screen to be non-retina and just use our given resolution
                    launchOptions.args.push('--force-device-scale-factor=1')
                    launchOptions.args.push('--disable-gpu')
                    launchOptions.args.push('--disable-software-rasterizer')
                }

                if (browser.name === 'electron' && browser.isHeadless) {
                    // might not work on CI for some reason
                    launchOptions.preferences.width = width
                    launchOptions.preferences.height = height
                }

                if (browser.name === 'firefox' && browser.isHeadless) {
                    launchOptions.args.push(`--width=${width}`)
                    launchOptions.args.push(`--height=${height}`)
                }
                return launchOptions
            });

            // IMPORTANT: return the updated config object for Cypress to use it
            Object.assign(config, reporterConfig);
            Object.assign(config.env, envConfig.env);
            const result = cloudPlugin(on, config);
            return result;
        }
    }
});