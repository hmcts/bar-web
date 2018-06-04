// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const karmaJasmine = require('karma-jasmine');
const karmaJasmineHtmlReporter = require('karma-jasmine-html-reporter');
const karmaPhantomJsLauncher = require('karma-phantomjs-launcher');
const karmaIntlShim = require('karma-intl-shim');
const karmaCoverageInstanbulReporter = require('karma-coverage-istanbul-reporter');
const karmaAngularPluginsKarma = require('@angular/cli/plugins/karma');
// const karmaChromeLauncher = require('karma-chrome-launcher');


module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli', 'intl-shim'],
    plugins: [
      // karmaChromeLauncher,
      karmaJasmine,
      karmaJasmineHtmlReporter,
      karmaPhantomJsLauncher,
      karmaIntlShim,
      // require('./en-us.js'),
      karmaCoverageInstanbulReporter,
      karmaAngularPluginsKarma
    ],
    // leave Jasmine Spec Runner output visible in browser
    client: { clearContext: false },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'reports',
      subdir: 'coverage'
    },
    angularCli: { environment: 'dev' },
    reporters: ['progress', 'kjhtml', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    watch: true
  });
};
