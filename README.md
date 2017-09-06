# Banking & Accounting returns

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This is the frontend application for BAR.

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) >= v7.2.0
* [yarn](https://yarnpkg.com/)
* [Gulp](http://gulpjs.com/)

#### Private NPM repository

Private NPM repository is defined in `.npmrc` file. All dependencies should be pulled from the private repository. Pulling dependencies from the public NPM registry can not be guaranteed on the CI server.

### Running the application

Install dependencies by executing the following command:

 ```bash
$ yarn install
 ```

Run:

```bash
$ yarn start
```

It will be available at https://localhost:3000

## Developing

### Code style

We use [TSLint](https://palantir.github.io/tslint/) with [StandardJS](http://standardjs.com/index.html) rules alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting:
`yarn lint`

### Running the tests

Mocha is used for writing tests.
Run them with:
```bash
$ yarn test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details
