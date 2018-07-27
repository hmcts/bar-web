import { Component, OnInit } from '@angular/core';
import { IResponse } from '../../interfaces';
import { UtilService } from '../../../shared/services/util/util.service';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { SearchModel } from '../../models/search.model';
import { CheckAndSubmit } from '../../models/check-and-submit';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { FeeDetailModel } from '../../models/feedetail.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-payment-review',
  templateUrl: './payment-review.component.html',
  styleUrls: ['./payment-review.component.css'],
  providers: [PaymentslogService, PaymenttypeService]
})
export class PaymentReviewComponent implements OnInit {
  static bgcTypes = ['cheques', 'postal-orders', 'cash'];

  piModels: PaymentInstructionModel[] = [];
  casModels: CheckAndSubmit[] = [];
  allSelected = false;
  toCheck = 0;
  toBeSubmitted = 0;
  openedTab = 1;
  userId: string;
  paymentType: string;
  status: string;
  showModal = false;
  bgcNumber: string;
  piIds: string;

  constructor(private paymentsLogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    combineLatest(this.route.params, this.route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val.params && val.params.id) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
          this.paymentType = val.qparams.paymentType;
          this.piIds = val.qparams.piIds;
          this.loadPaymentInstructionModels();
        }
      });
  }

  async loadPaymentInstructionModels() {
    this.casModels = [];
    this.piModels = [];
    const searchModel: SearchModel = new SearchModel();
    searchModel.id = this.userId;
    searchModel.status = this.status;
    searchModel.paymentType = this.paymentType;
    searchModel.piIds = this.piIds;

    this.paymentsLogService.getPaymentsLogByUser(searchModel)
      .subscribe(
        (response: IResponse) => {
          if (!response.success) {}
          this.piModels = response.data.map(paymentInstructionModel => {
            const model = new PaymentInstructionModel();
            model.assign(paymentInstructionModel);
            model.status = PaymentStatus.getPayment(model.status).code;
            this.status = model.status;
            return model;
          });

          this.toCheck = this.piModels.filter((model: PaymentInstructionModel) => model).length;

          // reassign the casModels (to be displayed in HTML)
          this.casModels = this.getPaymentInstructionsByFees(this.piModels);
          this.changeTabs(1);
        },
        err => {
          console.error(err);
        });
  }

  changeTabs(tabNumber: number) { this.openedTab = tabNumber; }

  // TODO: code smell, I've seen this code somewhere
  getPaymentInstructionsByFees(piModels: PaymentInstructionModel[]): CheckAndSubmit[] {
    if (!piModels) {
      return this.casModels;
    }

    piModels.forEach(piModel => {
      if (!piModel.case_fee_details.length) {
        const model: CheckAndSubmit = new CheckAndSubmit();
        model.convertTo( piModel );
        this.casModels.push( model );
        return;
      }
      piModel.case_fee_details.forEach((feeDetail: FeeDetailModel) => {
        const casModel: CheckAndSubmit = new CheckAndSubmit();
        casModel.convertTo(piModel, feeDetail);
        this.casModels.push(casModel);
      });
    });

    const finalCasModels = this.reformatCasModels(this.casModels);
    return finalCasModels;
  }

  async onSubmission(type = 'approve', bgcNumber?: string) {
    const piModelsToSubmit = this.casModels.filter(piModel => (piModel.checked === true && piModel.getProperty('paymentId')));

    for (let i = 0; i < piModelsToSubmit.length; i++) {
      const paymentInstructionModel = this.piModels.find(piModel => piModel.id === piModelsToSubmit[i].paymentId);
      if (!paymentInstructionModel) {
        console.error('unable to find payment instruction with id: ', piModelsToSubmit[i].paymentId);
        continue;
      }
      if (type === 'reject') {
        await UtilService.toAsync(this.paymentsLogService.rejectPaymentInstruction(piModelsToSubmit[i].paymentId).toPromise());
        continue;
      }
      if (type === 'approve') {
        paymentInstructionModel.status = PaymentStatus.getPayment('Approved').code;
      }
      if (type === 'transferredtobar') {
        paymentInstructionModel.status = PaymentStatus.getPayment('Transferred To Bar').code;
      }
      if (this.isBgcNeeded(paymentInstructionModel.payment_type.id) && type === 'approve') {
        if (bgcNumber) {
          paymentInstructionModel.bgc_number = bgcNumber;
        } else {
          console.error(paymentInstructionModel.payment_type, ' type payment instruciton needs to have bgc number');
          break;
        }
      }
      await UtilService.toAsync(this.paymentTypeService.savePaymentModel(paymentInstructionModel));
    }

    this.allSelected = false;
    this.showModal = false;
    this.loadPaymentInstructionModels();
  }

  selectPaymentInstruction(model: CheckAndSubmit) {
    model.checked = !model.checked;
    const selectedPiModels = this.casModels.filter(piModel => (piModel.checked === true && piModel.getProperty('paymentId')));
    if (this.piModels.length === selectedPiModels.length) {
      this.allSelected = true;
      return;
    }

    this.allSelected = false;
  }

  selectAllPaymentInstruction() {
    this.allSelected = !this.allSelected;
    this.casModels.forEach(model => model.checked = this.allSelected);
  }

  openModal() {
    const piModelsToSubmit = this.casModels.filter(piModel => (piModel.checked && piModel.getProperty('paymentId')));
    const needModal = piModelsToSubmit.some(piModel => this.isBgcNeeded(piModel.paymentType.id));
    if (needModal) {
      this.showModal = true;
    } else {
      this.onSubmission('approve');
    }
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

  private isBgcNeeded(typeId: string) {
    return PaymentReviewComponent.bgcTypes.indexOf(typeId) > -1;
  }

}
