import {Component, OnInit} from '@angular/core';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {IPaymentsLog} from '../../interfaces/payments-log';
import {UserService} from '../../../shared/services/user/user.service';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {IResponse} from '../../interfaces/response';
import {PaymentstateService} from '../../../shared/services/state/paymentstate.service';
import {forkJoin} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {from} from 'rxjs/internal/observable/from';
import {map} from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'app-components',
  templateUrl: './paymentslog.component.html',
  providers: [PaymentslogService, PaymenttypeService],
  styleUrls: ['./paymentslog.component.css']
})
export class PaymentslogComponent implements OnInit {
  payments_logs: IPaymentsLog[] = [];
  fieldSelected = false;
  selectAllPosts = false;
  multipleSelectedPosts = 0;

  submittedPaymentCount$: Observable<number>;

  constructor(
    private paymentsLogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private userService: UserService,
    private _paymentStateService: PaymentstateService
  ) { }

  ngOnInit() {
    this.getPaymentLogs();
    this.submittedPaymentCount$ = this.getCurrentPaymentCount();
  }

  get allPaymentInstructionsSelected(): boolean {
    return this.payments_logs.every(paymentInstruction => paymentInstruction.selected);
  }

  get hasChecked(): boolean {
    return (this.payments_logs.filter(paymentInstruction => paymentInstruction.selected).length > 0);
  }

  getPaymentLogs(): void {
     this.paymentsLogService.getPaymentsLog(this.userService.getUser(), PaymentStatus.DRAFT)
      .then((response: IResponse) => {
        console.log('Response: ' + response.data);
        this.payments_logs = [];
        response.data.forEach((payment: IPaymentsLog) => {
          const model = new PaymentInstructionModel();
          model.assign(payment);
          model.selected = false;
          this.payments_logs.push(model);
        });
      })
      .catch(err => {
        console.error(err);
        this.payments_logs = [];
      });
  }

  getCurrentPaymentCount() {
    return from(this.paymentsLogService
      .getPaymentsLog(
        this.userService.getUser(),
        PaymentStatus.PENDING,
        moment().format('DDMMYYYY'),
        moment().format('DDMMYYYY')))
      .pipe(map((data: IResponse) => data.data.length));
  }
  // ------------------------------------------------------------------------------------
  onAlterCheckedState(paymentInstruction: IPaymentsLog): void {
    paymentInstruction.selected = !paymentInstruction.selected;
  }

  onFormSubmission(): void {
    const savePaymentModels = [];
    const paymentInstructions = this.payments_logs.filter(paymentInstruction => paymentInstruction.selected === true);
    paymentInstructions.forEach((paymentInstruction: IPaymentsLog) => {
      const paymentInstructionModel = new PaymentInstructionModel();
      paymentInstructionModel.assign(paymentInstruction);
      paymentInstructionModel.status = PaymentStatus.PENDING;
      savePaymentModels.push(this.paymentTypeService.savePaymentModel(paymentInstructionModel));
    });

    forkJoin(savePaymentModels).subscribe(result => {
        this.getPaymentLogs();
        this.selectAllPosts = false;
        this.submittedPaymentCount$ = this.getCurrentPaymentCount();
      }, console.log);
  }

  onFormSubmissionDelete(): void {
    const deletePaymentModels = [];
    const paymentInstructions = this.payments_logs.filter(paymentInstruction => paymentInstruction.selected === true);
    paymentInstructions.forEach((paymentInstruction: IPaymentsLog) => {
      deletePaymentModels.push(this.paymentsLogService.deletePaymentLogById(paymentInstruction.id));
    });

    forkJoin(deletePaymentModels).subscribe(() => {
      this.getPaymentLogs();
      this.selectAllPosts = false;
    });
  }

  onSelectAllPosts(): void {
    this.selectAllPosts = !this.selectAllPosts;
    this.payments_logs.forEach(paymentInstruction => paymentInstruction.selected = this.selectAllPosts);
  }
}
