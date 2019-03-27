/* eslint-disable */
'use strict';

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

  async toggleSendToPayhubFeature(enabled) {
    const helper = this.helpers['Puppeteer'];
    const checkBoxChecked = await helper.grabAttributeFrom('#send-to-payhub', 'checked');
    if (Boolean(checkBoxChecked) !== enabled) {
      await helper.checkOption('#send-to-payhub');
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
}

module.exports = Helpers;
