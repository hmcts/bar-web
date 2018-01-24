import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { FeeLogModel } from '../../models/feelog.model';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { FeelogService } from '../../services/feelog/feelog.service';
import { UtilService } from '../../services/util/util.service';
import { PaymentstateService } from '../../state/paymentstate.service';

@Component({
  selector: 'app-feelogedit',
  templateUrl: './feelogedit.component.html',
  providers: [FeelogService, PaymentslogService, PaymenttypeService],
  styleUrls: ['./feelogedit.component.css']
})
export class FeelogeditComponent implements OnInit {
  loadedId: string;
  model: FeeLogModel = new FeeLogModel();
  modalOn = false;
  returnModalOn = false;
  caseNumberModel = '';
  openedTab = this.paymentState.state.currentOpenedFeeTab;
  feeDetailsModal = false;
  feeCodes: {}[] = [];
  selectedFee: any = false;
  feeDescription = '';
  feeAmount = 0.00;
  searchFeeModel = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private paymentLogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private feeLogService: FeelogService,
    private location: Location,
    private paymentState: PaymentstateService) { }

  ngOnInit() {
    if (!this.userService.getUser()) {
      return this.router.navigateByUrl('/');
    }

    this.route.params.subscribe(params => {
      if (typeof params.id !== 'undefined') {
        this.loadedId = params.id;
        if (/[0-9]/.test(this.loadedId)) {
          this.loadFeeById(this.loadedId);
        } else {
          this.router.navigateByUrl('/paymentslog');
        }
      }
    });
  }

  async loadFeeById(feeId) {
    try {
      const request = await this.paymentLogService.getPaymentById( feeId );
      if (request.success === true) {
        this.model = request.data;
        if (this.model.case_references.length > 0) {
          this.caseNumberModel = this.model.case_references[0].case_reference;
        }
      }
    } catch (e) {
      console.log( e );
    }
  }

  async addCaseReference($event) {
    $event.preventDefault();
    try {
      if (this.model.case_references.length < 1) {
        const createCaseNumber = await this.paymentLogService.createCaseNumber( this.model.id, { case_reference: this.caseNumberModel });
        if (createCaseNumber.success === true) {
          this.model = createCaseNumber.data;
          this.toggleCaseModalWindow();
        }
      }
    } catch (exception) {
      console.log( exception );
    }
  }

  changeTabs(tabNumber: number) {
    this.openedTab = tabNumber;

    // set the state of the opened tab - for other shared components etc
    this.paymentState.setCurrentOpenedFeeTab(this.openedTab);
  }

  goBack() {
    this.location.back();
  }

  toggleCaseModalWindow(): void {
    this.modalOn = !this.modalOn;
  }

  toggleReturnModal() {
    this.returnModalOn = !this.returnModalOn;
  }

  async returnPaymentToPostClerk() {
    try {
      this.model.status = 'D';
      this.toggleReturnModal();

      // redirect to feelog list
      return this.router.navigateByUrl('/feelog');
    } catch (exception) {
      console.log( exception );
    }
  }

  async openFeeDetailsModal() {
    this.feeDetailsModal = !this.feeDetailsModal;
  }

  updateDescAndAmount(feeCodeModel) {
    this.selectedFee = feeCodeModel;
    this.feeDescription = feeCodeModel.current_version.description;
    this.feeAmount = 99.99;
  }

  async loadFeeCodesAndDescriptions() {
    const [err, data] = await UtilService.toAsync(this.feeLogService.getFeeCodesAndDescriptions(this.searchFeeModel));
    if (!err) {
      if (data.found) {
        this.feeCodes = data.fees;
      }
    }
  }

  onKeyUpFeeCodesAndDescriptions($ev) {
    if ($ev.which === 13) {
      this.loadFeeCodesAndDescriptions();
    }
  }

  async addFeeToCase() {
    const dataToSend = {
      case_reference_id: this.model.case_references[0].id,
      fee_code: this.selectedFee.code,
      amount: 99.99,
      fee_description: this.feeDescription,
      fee_version: this.selectedFee.current_version.version // need to ask about this, we need to know which version to chose from
    };

    console.log( dataToSend );

    const [err, data] = await UtilService.toAsync(this.feeLogService.addFeeToCase(this.loadedId, dataToSend));
    console.log( err, data );
  }

}
