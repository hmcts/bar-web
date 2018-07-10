'use strict'

var request = require('request')

module.exports = function () {

  const idamUrl = process.env.IDAM_URL || 'http://localhost:4551'

  return actor({
    createUser: function (email, password) {
      request({
        uri: idamUrl + '/testing-support/accounts',
        method: 'POST',
        json: {
          'email': email,
          'forename': 'Forename',
          'surname': 'Surname',
          'password': password,
          'roles': ['admin']
        }
      })
    }
  })
}
