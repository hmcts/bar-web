const pa11y = require('pa11y');
const config = require('config');

const { url } = config.get('bar');

console.log( url );

pa11y('http://localhost:4200')
  .then(results => console.log(results.issues.length ? results.issues : 'Clean :)'));
