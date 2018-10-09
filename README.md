# Banking & Accounting Returns (Angular Project)

This is the frontend application for BAR.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

#### Private NPM repository

Private NPM repository is defined in `.npmrc` file. All dependencies should be pulled from the private repository. Pulling dependencies from the public NPM registry can not be guaranteed on the CI server.


### Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) >= v7.2.0
* [Angular CLI](https://cli.angular.io/) >= 1.4.9

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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
## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Before pushing to deployment

Run the following commands:

* `yarn lint`
* `yarn test-dev`
* `yarn test`
* `yarn build`

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md)
