/* eslint-disable newline-per-chained-call */
/* eslint-disable no-magic-numbers */
const BARATConstants = require('./BARAcceptanceTestConstants');

const time = new Date().getTime();
const paymentReferenceSite1 = `${time}`.substr(7, 6);
const paymentReferenceSite2 = `${time + 1}`.substr(7, 6);
let payerNameSite1 = '';
let payerNameSite2 = '';

Feature('BAR multi site users tests');

Before(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
});

Scenario('Switch sites and check payment visibility', async I => {
  const type = {
    id: '#payment_type_POSTAL_ORDER',
    reference: 'Postal order number'
  };
  const createPayment = (name, amount, ref) => {
    I.createPayment(type, name, amount, ref);
    I.click('Payments list');
    I.waitForText(name, BARATConstants.tenSecondWaitTime);
    I.see(ref);
  };
  I.login('SiteSwitchFee@mailnesia.com', 'LevelAt12');
  I.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
  let text = await I.grabHTMLFrom('//div/div/ul[2]/li[1]/a');
  payerNameSite1 = text[0].substring(0, text[0].indexOf('<')).trim();
  createPayment(payerNameSite1, '550', paymentReferenceSite1);
  I.SwitchSite();
  I.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
  text = await I.grabHTMLFrom('//div/div/ul[2]/li[1]/a');
  payerNameSite2 = text[0].substring(0, text[0].indexOf('<')).trim();
  createPayment(payerNameSite2, '550', paymentReferenceSite2);
  I.dontSee(payerNameSite1);
  I.SwitchSite();
  I.dontSee(payerNameSite2);
  I.Logout();
});