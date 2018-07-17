Feature('BAR Smoke Test');

Scenario('BAR Web Health Check Test', I => {
  I.amOnPage('/');
  I.see('{"status":"UP"}');
});