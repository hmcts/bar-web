const ProxySettings = require('./proxy-settings')

exports.config = {
  name: 'bar-web-acceptance-tests',
  tests: './test/end-to-end/tests/*_test.js',
  timeout: 10000,
  output: './output',
  helpers: {
    /*WebDriverIO: {
      host: process.env.WEB_DRIVER_HOST || 'localhost',
      port: process.env.WEB_DRIVER_PORT || '4444',
      browser: process.env.BROWSER || 'chrome',
      url: process.env.URL || 'https://bar-web-aat.service.core-compute-aat.internal/', waitForTimeout: 15000,

        desiredCapabilities: {
            acceptSslCerts: true,
           // trustAllSSLCertificates: true,
         // ignoreCerficateErrors: true,
          //proxy: new ProxySettings(),
          proxy: { proxyType: 'manual',
              httpProxy: "proxyout.reform.hmcts.net:8080"
          }
      }
    },*/
      Puppeteer: {
          url: 'https://bar-web-aat.service.core-compute-aat.internal',
         // waitForTimeout,
          //waitForAction,
          show: false,
          restart: false,
          keepCookies: false,
          keepBrowserState: false,
          networkIdleTimeout: 5000,
          waitUntil: 'networkidle',
          timeout: 3000000,
          chrome: {
              ignoreHTTPSErrors: true,
              args: [
                  '--no-sandbox',
                  '--proxy-server=proxyout.reform.hmcts.net:8080',
                  '--proxy-bypass-list=*beta*LB.reform.hmcts.net'
              ]
          }
      },
  },
  include: {
    I: './test/end-to-end/pages/steps_file.js',
    Idam: './test/end-to-end/pages/idam_backdoor.js'
  },
  mocha: {
        "reporterOptions": {
            "mochaFile": "output/result.xml",
            "reportDir": "output"
        }
    },
  Mochawesome: {
        "uniqueScreenshotNames": "true"
    },
  bootstrap: false,
}