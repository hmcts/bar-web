const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Post Clerk Submit Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/');
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('barpreprodpostclerk@mailinator.com', 'LevelAt12');
  // I.addMochawesomeContext('simple string');
});

Scenario('Select Payment Type Card', I => {
  I.paymentTypeCard();
});

Scenario('Submit Card Payment', I => {
  I.submitAllPaymentInformation();
  I.Logout();
});
