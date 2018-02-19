import { Component, OnInit } from '@angular/core';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { SearchModel } from '../../models/search.model';
import { UtilService } from '../../services/util/util.service';
import { IResponse } from '../../interfaces/index';
import { CheckAndSubmit } from '../../models/check-and-submit';
import {FeeDetailModel} from '../../models/feedetail.model';
import {CaseReferenceModel} from '../../models/casereference';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';

@Component({
  selector: 'app-check-submit',
  templateUrl: './check-submit.component.html',
  styleUrls: ['./check-submit.component.css'],
  providers: [PaymentslogService, PaymenttypeService],
})
export class CheckSubmitComponent implements OnInit {
  piModels: PaymentInstructionModel[] = new Array<PaymentInstructionModel>();
  casModels: CheckAndSubmit[] = new Array<CheckAndSubmit>();
  allSelected = false;
  toCheck = 0;
  toBeSubmitted = 0;

  constructor(private paymentsLogService: PaymentslogService, private paymentTypeService: PaymenttypeService) { }

  ngOnInit() {
    this.loadPaymentInstructionModels();
  }

  async loadPaymentInstructionModels() {
    this.casModels = [];
    this.piModels = [];
    const searchModel: SearchModel = new SearchModel();
    searchModel.status = 'V';
    const [err, payments] = await UtilService
      .toAsync(this.paymentsLogService.searchPaymentsByDate(searchModel));

    // console.log('There seems to be an error.', err);
    if (err) { return; }

    const response: IResponse = payments;
    this.piModels = response.data.map(paymentInstructionModel => {
      const model = new PaymentInstructionModel();
      model.assign(paymentInstructionModel);
      return model;
    });

    this.toCheck = this.piModels.filter((model: PaymentInstructionModel) => model).length;

    // reassign the casModels (to be displayed in HTML)
    this.casModels = this.getPaymentInstructionsByFees(this.piModels);
  }

  getPaymentInstructionsByFees(piModels: PaymentInstructionModel[]): CheckAndSubmit[] {
    if (!piModels) {
      return this.casModels;
    }

    piModels.forEach(piModel => {
      if (!piModel.case_references.length) {
        const model: CheckAndSubmit = new CheckAndSubmit();
        model.convertTo( piModel );
        this.casModels.push( model );
        return;
      }

      piModel.case_references.forEach((caseReference: CaseReferenceModel) => {
        if (!caseReference.case_fee_details.length) {
          const model: CheckAndSubmit = new CheckAndSubmit();
          model.convertTo( piModel, caseReference );
          this.casModels.push( model );
          return;
        }

        caseReference.case_fee_details.forEach((feeDetail: FeeDetailModel) => {
          const casModel: CheckAndSubmit = new CheckAndSubmit();
          casModel.convertTo(piModel, caseReference, feeDetail);
          this.casModels.push(casModel);
        });
      });
    });

    const finalCasModels = this.reformatCasModels( this.casModels );
    return finalCasModels ;
  }

  async onSubmission() {
    const piModelsToSubmit = this.casModels.filter(piModel => (piModel.checked === true && piModel.getProperty('paymentId') !== '-'));

    for (let i = 0; i < piModelsToSubmit.length; i++) {
      const paymentInstructionModel = this.piModels.find(piModel => piModel.id === piModelsToSubmit[i].paymentId);
      if (paymentInstructionModel) {
        console.log( paymentInstructionModel );
        paymentInstructionModel.status = PaymentStatus.PENDINGAPPROVAL;
        await UtilService.toAsync(this.paymentTypeService.savePaymentModel(paymentInstructionModel));
      }
    }

    this.loadPaymentInstructionModels();
  }

  selectPaymentInstruction(model: CheckAndSubmit) {
    model.checked = !model.checked;
    const selectedPiModels = this.casModels.filter(piModel => (piModel.checked === true && piModel.getProperty('paymentId') !== '-'));
    if (this.piModels.length === selectedPiModels.length) {
      this.allSelected = true;
    }
  }

  selectAllPaymentInstruction() {
    this.allSelected = !this.allSelected;
    this.casModels.forEach(model => model.checked = this.allSelected);
  }

  private reformatCasModels(models: CheckAndSubmit[]) {
    if (models.length) {

      // loop through (and prevent duplicates from showing)
      const finalModels: CheckAndSubmit[] = [];
      models.forEach(model => {
        const check = finalModels.find(finalModel => {
          return finalModel.paymentId === model.paymentId;
        });

        if (check) {
          model.removeDuplicateProperties();
        }

        finalModels.push(model);
      });

      return finalModels;
    }
  }

}
