import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { UserService } from '../../../shared/services/user/user.service';
import { IPaymentType, IResponse } from '../../interfaces/index';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import 'rxjs/add/operator/switchMap';
import { makeParamDecorator } from '@angular/core/src/util/decorators';
import { UserType } from '../../models/usertype';
import { PaymentStatus } from '../../models/paymentstatus.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [PaymentslogService, PaymenttypeService],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  model: PaymentInstructionModel = new PaymentInstructionModel();
  paymentTypes: IPaymentType[] = [];
  filledContent = false;
  showModal = false;
  newDataId = 0;
  loadedId = null;
  changePayment = false;

  constructor(
    private paymentTypeService: PaymenttypeService,
    private paymentLogService: PaymentslogService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  async ngOnInit() {
    // if (!this.userService.getUser()) {
    //   // Return early by redirecting to login if not authenticated
    //   return this.router.navigateByUrl('/');
    // }

    // load payment types
    await this.loadPaymentTypes();

    // subscribe to the paymenttypes list
    this.paymentTypeService.paymentTypesSource.subscribe(payments => {
      this.paymentTypes = payments;
    });

    this.route.params.subscribe(params => {
      if (typeof params.id !== 'undefined') {
        this.loadedId = params.id;
        if (/[0-9]/.test(this.loadedId)) {

          // for the purposes of allowing the payment-types to be altered.
          if (this.router.url.includes('/change-payment')) {
            this.changePayment = true;
          }
          this.loadPaymentDataById(this.loadedId);
        } else {
          this.router.navigateByUrl('/paymentslog');
        }
      }
    });
  }

  onFormSubmission() {
    const { type } = this.userService.getUser();

    if (type === UserType.POSTCLERK) {
      this.model.status = PaymentStatus.DRAFT;
    }

    if (type === UserType.FEECLERK) {
      this.model.status = PaymentStatus.PENDING;
    }
    console.log( this.model );

    this.paymentTypeService.savePaymentModel(this.model)
      .then(response => {
        this.resetData();

        if (response.data !== null) {
          this.newDataId = response.data.daily_sequence_id;
          if (typeof this.model.id === 'undefined') {
            this.showModal = true;
            return;
          }
        }

      if (this.userService.getUser().type === 'feeclerk') {
        return this.router.navigateByUrl('/feelog');
      }

        return this.router.navigateByUrl('/paymentslog');
    })
    .catch(err => console.log(err));
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
    this.location.back();
  }

  private async loadPaymentDataById(paymentID) {
    try {
      const response = await this.paymentLogService.getPaymentById(paymentID);
      this.model = response.data;
      this.model.payment_type = this.model.payment_type.id;
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
      if (paymentTypes.success === true) {
        const paymentTypesBatch: IPaymentType[] = [];
        for (let i = 0; i < paymentTypes.data.length; i++) {
          const paymentType: IPaymentType = {
            id: paymentTypes.data[i].id,
            name: paymentTypes.data[i].name
          };
          paymentTypesBatch.push(paymentType);
        }
        this.paymentTypeService.setPaymentTypeList( paymentTypesBatch );
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
        cleanData[property] = this.model[property];
      }
    }

    return cleanData;
  }

  private resetData(): void {
    if (!this.loadedId) {
      this.model.amount = null;
      this.model.payer_name = '';
    }

    this.model.all_pay_transaction_id = '';

    this.model.cheque_number = '';
    this.model.postal_order_number = '';
  }
}
