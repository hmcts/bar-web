const faker = require('faker');
const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Fee Clerk Add Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  I.wait(BARATConstants.fiveSecondWaitTime);
});

Scenario('Add Payment Instruction', I => {
  I.checkAddPaymentInstructionPage();
});

Scenario('Select Payment Type Cheque', I => {
  I.feeclerkChequePaymentType();
});

Scenario('Select Payment Type Postal Order', I => {
  I.feeclerkPostalOrderPaymentType();
});

Scenario('Select Payment Type Cash', I => {
  I.feeclerkCashPaymentType();
});

Scenario('Select Payment Type All Pay', I => {
  I.feeclerkAllPayPaymentType();
});

Scenario('Select Payment Type Card', I => {
  I.feeclerkCardPaymentType();
  I.Logout();
});

Scenario('Want to revert to Pending Status.', I => {
  const cashPayername = faker.name.firstName();

  // Wait to add Payment Instruction
  I.wait(BARATConstants.twoSecondWaitTime);
  I.see('Payer name');
  I.see('Amount');
  I.fillField('Payer name', cashPayername);
  I.fillField('Amount', '100');
  I.click({ css: '.button-view' });
  I.wait(BARATConstants.twoSecondWaitTime);
  I.waitForText('Payment information added', BARATConstants.fiveSecondWaitTime);
  I.click({ css: '.button-cancel' });

  // Time to edit the payment instruction and add fees
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.waitForElement('[button-name="add-fee-details"]', BARATConstants.twoSecondWaitTime);
  I.click({ css: '[button-name="add-fee-details"]' });

  I.see('Case number');
  I.see('Search for a Fee');

  I.fillField('Case number', 'Y2984HJQ');
  I.fillField('Search for a Fee', '100');
  I.wait(BARATConstants.fiveSecondWaitTime);

  I.click({ css: '.fee-search table tr td a.fee-action' });
  I.see('Fee details');
  I.see('Code:');
  I.see('Description:');
  I.see('Amount:');

  I.click('Save');
  I.selectOption('Action:', 'Process');
  I.click('Submit');

  // Click on Check and Submit to ensure payment is "Validated"
  I.see('Check and submit');
  I.click('Check and submit');
  I.see(cashPayername);

  I.click({ xpath: '//*[@id="check-and-submit-table"]/tbody/tr[1]/td[1]/a' });
  I.waitForText('Revert to Pending status', BARATConstants.fiveSecondWaitTime);
  // @TODO: Check the click on the new name
});
