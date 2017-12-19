import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { UserService } from '../../services/user/user.service';
import { IPaymentType, IResponse } from '../../interfaces/index';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import 'rxjs/add/operator/switchMap';
import { makeParamDecorator } from '@angular/core/src/util/decorators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [PaymentslogService, PaymenttypeService],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  model: PaymentInstructionModel = new PaymentInstructionModel();
  payment_types: IPaymentType[] = [];
  filledContent = false;
  showModal = false;
  newDataId = 0;
  loadedId = null;

  constructor(
    private paymentTypeService: PaymenttypeService,
    private paymentLogService: PaymentslogService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      // Return early by redirecting to login if not authenticated
      return this.router.navigateByUrl('/');
    }

    await this.loadPaymentTypes();

    this.route.params.subscribe(params => {
      if (typeof params.id !== 'undefined') {
        this.loadedId = params.id;
        if (/[0-9]/.test(this.loadedId)) {
          this.loadPaymentDataById(this.loadedId);
        } else {
          this.router.navigateByUrl('/paymentslog');
        }
      }
    });
  }

  async onFormSubmission() {
    try {
      const data: any = this.cleanData();
      const makePayment = await this.paymentTypeService.savePaymentModel(data);
      this.resetData();
      this.newDataId = makePayment.data.daily_sequence_id;
      if (typeof data.id === 'undefined') {
        this.showModal = true;
      } else {
        return this.router.navigateByUrl('/paymentslog');
      }
    } catch (error) {
      console.log(error);
    }
  }

  onInputPropertyChange($ev): void {
    // check if all the fields are empty or not
    if (this.hasPopulatedField()) {
      this.filledContent = true;
    } else {
      this.filledContent = false;
    }
  }

  onToggleShowModal(): void {
    this.showModal = false;
    this.newDataId = 0;
  }

  redirectBackPaymentLog() {
    this.router.navigateByUrl('/paymentslog');
  }

  private async loadPaymentDataById(paymentID) {
    try {
      const response = await this.paymentLogService.getPaymentById(paymentID);
      this.model = response.data;
      this.model.payment_type = this.model.payment_type.id;

      console.log( this.model );
    } catch (exception) {
      console.log( exception );
    }
  }

  private hasPopulatedField(): boolean {
    let hasPopulatedField = false;

    for (const property in this.model) {
      if (this.model.hasOwnProperty(property)) {
        if (property === 'currency' || property === 'payment_type') {
          continue;
        }

        if (this.model[property].length > 0) {
          hasPopulatedField = true;
          break;
        }
      }
    }

    return hasPopulatedField;
  }

  private async loadPaymentTypes() {
    try {
      const paymentTypes: any = await this.paymentTypeService.getPaymentTypes();
      for (let i = 0; i < paymentTypes.data.length; i++) {
        this.payment_types.push(paymentTypes.data[i]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private cleanData(): {} {
    const cleanData = {};
    for (const property in this.model) {
      if (
        this.model.hasOwnProperty(property) &&
        this.model[property] !== ''
      ) {
        if (property === 'amount') {
          cleanData[property] = parseFloat(this.model[property]) * 100;
        } else {
          cleanData[property] = this.model[property];
        }
      }
    }

    return cleanData;
  }

  private resetData(): void {
    if (!this.loadedId) {
      this.model.amount = '';
      this.model.payer_name = '';
    }

    this.model.all_pay_transaction_id = '';

    this.model.cheque_number = '';
    this.model.postal_order_number = '';
  }
}
