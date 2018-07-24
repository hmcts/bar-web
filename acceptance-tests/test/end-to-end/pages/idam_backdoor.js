'use strict';

module.exports = () => {
  const idamUrl = process.env.IDAM_URL || 'http://localhost:4551';
  const createUserJson = {
    createUser: (email, password) => {
      return ({
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
  };
  return (createUserJson);
};
