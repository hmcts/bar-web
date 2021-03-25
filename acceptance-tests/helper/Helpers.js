/* eslint-disable */
'use strict';

const CONF = require('config');
const unirest = require('unirest');

class Helpers extends codecept_helper {
  // add custom methods here
  // If you need to access other helpers
  // use: this.helpers['helperName']

  async reloadIfElementNotFound(selector, timeout) {
    const helper = this.helpers['Puppeteer'];
    try {
      await helper.waitForElement(selector, timeout);
    } catch (e) {
      console.log(e);
      await helper.refreshPage();
      await helper.waitForElement(selector, timeout * 2);
    }
  }

  async reloadIfTextNotFound(text, timeout) {
    const helper = this.helpers['Puppeteer'];
    try {
      await helper.waitForText(text, timeout);
    } catch (e) {
      console.log(e);
      await helper.refreshPage();
      await helper.waitForText(text, timeout * 2);
    }
  }

  async turnAllFeatureOn() {
    const ids = ['#payment-actions-process', '#payment-actions-refund', '#make-editpage-readonly', '#full-remission', '#payment-actions-suspence-deficiency',
      '#payment-actions-withdraw', '#payment-actions-return', '#payment-actions-suspense', '#send-to-payhub'];
    const helper = this.helpers['Puppeteer'];
    for (let index = 0; index < ids.length; index++) {
      const element = ids[index];
      const checkBoxChecked = await helper.grabAttributeFrom(element, 'checked');
      if (!Boolean(checkBoxChecked)) {
        await helper.checkOption(element);
      }
    }
  }

  async seeAuthentication() {
    let client = this.helpers['Puppeteer'];
    const cookies = await client.page.cookies();
    for (let k in cookies) {
      // check for a cookie
      if (cookies[k].name != '__auth-token') continue;
      return cookies[k].value;
    }
    throw new Error('Missing "__auth-token"');
  }

  assignUsersToSite(users, site, token) {
    const promises = users.map(user => {
      return new Promise((resolve, reject) => {
        unirest.post(`${CONF.e2e.barApiUrl}/sites/${site}/users/${user}`)
          // .proxy(CONF.e2e.proxyUrl)
          .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': token })
          .strictSSL(false)
          .send({})
          .end(response => {
            if (response.body) {
              resolve(response.body);
            } else {
              reject(response);
            }
          });
      });
    });
    return Promise.all(promises);
  }
}

module.exports = Helpers;
