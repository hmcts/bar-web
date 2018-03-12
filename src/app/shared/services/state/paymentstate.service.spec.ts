import { TestBed, inject } from '@angular/core/testing';

import { PaymentstateService } from './paymentstate.service';
import { IPaymentType } from '../interfaces';

describe('PaymentstateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentstateService]
    });
  });

  it('should be created', inject([PaymentstateService], (service: PaymentstateService) => {
    expect(service).toBeTruthy();
  }));

  it('Should reflect the default currentOpenedFeeTab to be "1".',
    inject([PaymentstateService], (service: PaymentstateService) => {
      expect(service.state.currentOpenedFeeTab).toEqual(1);
    }));

  it('Should reflect the change to the default current opened fee tab.',
    inject([PaymentstateService], (service: PaymentstateService) => {
      const feeTab = 5;
      service.setCurrentOpenedFeeTab( feeTab );
      expect(service.state.currentOpenedFeeTab).toEqual( feeTab );
    }));

  it('Should reflect the change to the currentOpenedFeeTab.',
    inject([PaymentstateService], (service: PaymentstateService) => {
      const currentOpenedFeeTab = 3;
      service.setCurrentOpenedFeeTab( currentOpenedFeeTab );
      expect(service.state.currentOpenedFeeTab).toEqual( currentOpenedFeeTab );
    }));

  it('The number of items in an array should change once I have added one.',
    inject([PaymentstateService], (service: PaymentstateService) => {
      const paymentType: IPaymentType = { id: 'cash', name: 'Cash' };
      const paymentTypeArray: IPaymentType[] = [];
      paymentTypeArray.push( paymentType );
      service.setSharedPaymentTypes(paymentTypeArray);
      expect(service.state.paymentTypes.length).toBe(1);
    }));
});
