const BARATConstants = require('./BARAcceptanceTestConstants');

Feature('BAR Post Clerk Delete Payment Instruction');

BeforeSuite(I => {
  I.amOnPage('/login');
  I.resizeWindow(BARATConstants.windowsSizeX, BARATConstants.windowsSizeY);
  I.login('i118030@nwytg.com', 'LevelAt12');
});

Scenario('Select Payment Type Card', I => {
  I.paymentTypeCard();
});

Scenario('Delete Card Payment', I => {
  I.deletePaymentInformation();
  I.Logout();
});
