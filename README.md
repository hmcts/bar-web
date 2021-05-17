# BAR (Banking & Accounting Returns) | Angular Project
This is client side application for the BAR Application.
The technologies used to develop and test this application are the following:

* [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
* [CSS (SCSS)](https://sass-lang.com/)
* [Angular](https://angular.io/)
* [Karma](https://karma-runner.github.io/) - for Angular
* [CodeceptJS](https://codecept.io/) - for e2e / functionality testing
* [Mocha](https://mochajs.org/) - for Express
* [Chai](https://www.chaijs.com/) - for Express



## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) >=8.11.1 <10.0.0
* [Angular CLI](https://cli.angular.io/) >= 7.0.3
* [Yarn](https://yarnpkg.com/lang/en/) >= 7.0.3


## Mock Idam authentication
To be able to run and use the application locally another app should be running which mocks idam endpoints. This is the
https://github.com/hmcts/bar-idam-mock
To start the app on Linux/Mac run "make dev-start" and on windows "PORT=23443 npm run dev" it will start listen on port 23443.
the idam.api_url should be set to http://localhost:23443 in default.yml.
```
idam:
  api_url: http://localhost:23443
```

## Mock fees-register
To be able to use fees-register locally you need to checkout, run and point to the mock application
what can be found at https://github.com/hmcts/bar-idam-mock
To start the app on Linux/Mac run "make dev-start" and on windows "PORT=23443 npm run dev" it will start listen on port 23443.
the fee.url should be set to http://localhost:23443 in default.yml.
```
fee:
  url: http://localhost:23443
```

The same settings should be made on bar-app, so in the application.properties should contain this:
```
auth.idam.client.baseUrl=${IDAM_CLIENT_BASE_URL:http://localhost:23443}
```

## Installation & Development
Once you have installed "Mock Idam authentication" application and have it running, please follow the following steps below:

* Clone this (bar-web) repository
* Run `yarn` - to install the modules in package.json
* Run `yarn start:angular-dev` to start the Angular application
* Run `yarn start:express-dev` to start the web server


## Build SCSS files
* Run `gulp watch` to build and watch scss files inside src/assets/stylesheets
The SCSS files (in the src/app folder) are automatically compiled into css files, so there would be no need for gulp to watch the files.


## Committing files and testing
Once you have created (or modified) the files in this repository, prior to committing, please run the following:
* Run `yarn lint` - to ensure your files follow the coding standards
  * If there are problems, you can run `yarn lint --fix` to correct the issues. It may not necessarily correct everything. (Some manual correction may be needed).
* Run `yarn test:angular` - to test the Angular application
* Run `yarn test:express` - to test the Express application
* Run `yarn test:functional-local` - to run e2e tests
* Run `yarn nsp` -


## Build
If you would like to build the application:
* Run `yarn build` - This will build the Angular application (production standard) and place the compiled files into the /dist folder. Express will serve the compiled Angular application from the dist folder.


## Authors
* [Sho Carter-Daniel](https://uk.linkedin.com/in/sho-silva-carter-daniel-18347618)
* Attila Kiss
* Ravi Kumar
* Sachi Kuppuswami
* [Jalal Ul Deen](https://www.linkedin.com/in/jalaldeen/)

