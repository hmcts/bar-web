'use strict';

const request = require('request');

module.exports = () => {
  const idamUrl = process.env.IDAM_URL || 'http://localhost:4551';

  return ({
    createUser: (email, password) => {
      request({
        uri: `${idamUrl}/testing-support/accounts`,
        method: 'POST',
        json: {
          email,
          forename: 'Forename',
          surname: 'Surname',
          password,
          roles: ['admin']
        }
      });
    }
  });
};
