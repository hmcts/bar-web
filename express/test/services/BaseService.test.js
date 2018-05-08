// require modules
const chai = require('chai');
const mocha = require('mocha');

// get test libraries etc
const { beforeEach, describe, it } = mocha;
const { expect } = chai;
const BaseService = require('../../services/BaseService');

let BaseServiceMock = null;
let mockBarUrl = null;

// start tests
describe('Test: BaseService.test.js', () => {
  beforeEach(() => {
    mockBarUrl = 'http://localhost:80';
    BaseServiceMock = new BaseService();
  });

  it('Should ensure that uri and method exist and aren\'t blank or empty.', () => {
    const mockOptions = { uri: '', method: '' };
    expect(() => BaseServiceMock.configureOpts(mockOptions)).to.throw(Error);
  });

  it('Should ensure that both arguments are objects.', () => {
    const mockOptions = 1;
    const mockRequest = 2;
    expect(() => BaseServiceMock.configureOpts(mockOptions, mockRequest)).to.throw(Error);
  });

  it('Should remove json property from object if method type is DELETE.', () => {
    const mockOptions = { uri: `${mockBarUrl}/payment-instructions`, method: 'DELETE' };
    const generatedOptions = BaseServiceMock.configureOpts(mockOptions);
    expect(generatedOptions.json).to.equal(false);
  });
});
