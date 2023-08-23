/* eslint-disable */
'use strict';

class Helpers extends codecept_helper {
  // add custom methods here
  // If you need to access other helpers
  // use: this.helpers['helperName']

  async reloadIfElementNotFound(selector, timeout) {
    const helper = this.helpers['Playwright'];
    try {
      await helper.waitForElement(selector, timeout);
    } catch (e) {
      console.log(e);
      await helper.refreshPage();
      await helper.waitForElement(selector, timeout * 2);
    }
  }

  async reloadIfTextNotFound(text, timeout) {
    const helper = this.helpers['Playwright'];
    try {
      await helper.waitForText(text, timeout);
    } catch (e) {
      console.log(e);
      await helper.refreshPage();
      await helper.waitForText(text, timeout * 2);
    }
  }

}

module.exports = Helpers;
