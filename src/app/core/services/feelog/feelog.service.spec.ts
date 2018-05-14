import { TestBed, inject } from '@angular/core/testing';

import { FeelogService } from './feelog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {FeeDetailModel} from '../../models/feedetail.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';

describe('FeelogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule ],
      providers: [FeelogService]
    });
  });

  it('should be created', inject([FeelogService], (service: FeelogService) => {
    expect(service).toBeTruthy();
  }));

  it('calculate unallocated amount when fee is in edit mode', inject([FeelogService], (service: FeelogService) => {
    const feeLogModel = new PaymentInstructionModel();
    feeLogModel.unallocated_amount = 50000;

    const feeDetailModel = new FeeDetailModel();
    feeDetailModel.amount = 500;
    feeDetailModel.remission_amount = 300;
    feeDetailModel.refund_amount = 100;
    expect(service.getUnallocatedAmount(feeLogModel, feeDetailModel)).toEqual(200);

    feeLogModel.unallocated_amount = 30000;
    expect(service.getUnallocatedAmount(feeLogModel, feeDetailModel)).toEqual(0);

  }));

});
