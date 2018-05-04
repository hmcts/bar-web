// require modules
const chai = require('chai');
const mocha = require('mocha');

// get test libraries etc
const { beforeEach, describe, it } = mocha;
const { expect } = chai;
const BaseService = require('../../services/BaseService');

let BaseServiceMock = null;

// start tests
describe('Test: BaseService.test.js', () => {
  beforeEach(() => {
    BaseServiceMock = new BaseService();
  });

  // ensure we get payment types
  it('Should remove json property from object if method type is DELETE', () => {
    const mockBarUrl = 'http://localhost:80';
    const mockOptions = { uri: `${mockBarUrl}/payment-instructions`, method: 'DELETE' };
    const generatedOptions = BaseServiceMock.configureOpts(mockOptions);
    expect(generatedOptions.json).to.equal(false);
  });
});
