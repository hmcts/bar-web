// require modules
const chai = require('chai');
const mocha = require('mocha');

// get test libraries etc
const { beforeEach, describe, it } = mocha;
const { expect } = chai;
const UtilService = require('../../services/UtilService');

let mockBarUrl = null;

// start tests
describe('Test: UtilService.test.js', () => {
  beforeEach(() => {
    mockBarUrl = 'http://localhost:80';
  });

  it('Should ensure that uri and method exist and aren\'t blank or empty.', () => {
    const mockOptions = { uri: '', method: '' };
    expect(() => UtilService.setConfig(mockOptions)).to.throw(Error);
  });

  it('Should ensure that both arguments are objects.', () => {
    const mockOptions = 1;
    const mockRequest = 2;
    expect(() => UtilService.setConfig(mockOptions, mockRequest)).to.throw(Error);
  });

  it('Should remove json property from object if method type is DELETE.', () => {
    const mockOptions = { uri: `${mockBarUrl}/payment-instructions`, method: 'DELETE' };
    const generatedOptions = UtilService.setConfig(mockOptions);
    expect(generatedOptions.json).to.equal(false);
  });
});
