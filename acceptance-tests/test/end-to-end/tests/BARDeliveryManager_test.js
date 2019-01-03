const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Delivery Manager and Sr Fee Clerk Tests');

Before(I => {
  I.amOnPage('/');
  I.wait(BARATConstants.twoSecondWaitTime);
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
});
Scenario('FeeClerk Click and Submit', I => {
  I.login('barpreprodfeeclerk@mailinator.com', 'LevelAt12');
  I.retry(BARATConstants.retryCountForStep).reloadIfTextNotFound('Add payment information', BARATConstants.fiveSecondWaitTime);
  I.click('Add payment information');
  I.wait(BARATConstants.fiveSecondWaitTime);
  I.feeclerkChequePaymentType();
  I.Logout();
});

Scenario('Payments Overview', I => {
  I.login('barpreprodsrfeeclerk@mailinator.com', 'LevelAt12');
  I.reloadIfTextNotFound('Payments overview', BARATConstants.fiveSecondWaitTime);
  I.see('Payments overview');
  I.see('Reporting');
  I.see('User');
  I.see('Role');
  I.see('Carry Forward');
  I.see('Validated payments');
  I.see('Yet to submit');
  I.see('Submitted');
  I.see('Carry forward');
  I.see('Ready to review');
  I.see('Recorded');
  I.see('Pending');
  I.see('Transfer to BAR');
  I.see('Validated');
  I.see('Transferred to BAR');
  I.see('Pending Review');
  I.see('Pending Approval');
});

Scenario('Payments Pending Review and Approve', I => {
  I.SeniorFeeClerkCardPaymentType();
  I.Logout();
});

Scenario('Payments Pending review', I => {
  I.login('barpreprod@mailinator.com', 'LevelAt12');
  I.reloadIfTextNotFound('Payments overview', BARATConstants.fiveSecondWaitTime);
  I.see('Payments overview');
  I.see('Reporting');
  I.see('User');
  I.see('Role');
  I.see('Reviewed');
  I.see('Rejected');
  I.see('Approved');
  I.see('Carry forward');
  I.see('Ready to transfer to BAR');
  I.see('Recorded');
  I.see('Pending review');
  I.see('Transfer to BAR');
  I.see('Validated');
  I.see('Recorded');
  I.see('Pending');
  I.see('Transferred to BAR');
  I.see('Pending Review');
  I.see('Pending Approval');
});

Scenario('Transfer to BAR', { retries: 2 }, I => {
  I.DeliveryManagerTransferToBAR();
});

Scenario('Trying to confirm transfer to BAR when feature is disabled', { retries: 2 }, I => {
  I.toggleSendToPayhubFeature(false)
    .then(() => {
      I.DeliveryManagerConfirmTransferToBAR('This function is temporarily unavailable.');
    })
    .catch(error => {
      throw error;
    });
});

Scenario('Confirm transfer to BAR', { retries: 2 }, I => {
  I.toggleSendToPayhubFeature(true)
    .then(() => {
      I.DeliveryManagerConfirmTransferToBAR('successful');
      I.Logout();
    })
    .catch(error => {
      throw error;
    });
});
