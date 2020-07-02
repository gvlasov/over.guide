const {setHeadlessWhen} = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
    tests: './tests/*_test.ts',
    output: './output',
    require: [
        "ts-node/register",
    ],
    helpers: {
        WebDriver: {
            url: 'http://frontend:8000',
            browser: 'chrome'
        }
    },
    include: {
        I: './steps_file.js',
        Roster: './fragments/Roster.ts',
    },
    bootstrap: null,
    mocha: {},
    name: 'acceptance-tests',
    plugins: {
        retryFailedStep: {
            enabled: true
        },
        screenshotOnFail: {
            enabled: true
        }
    }
}