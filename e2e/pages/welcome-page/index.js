function amOnWelcomePage() {
  const I = this;

  I.amOnPage('/login');
  I.see('Login to your account');
}

module.exports = { amOnWelcomePage };
