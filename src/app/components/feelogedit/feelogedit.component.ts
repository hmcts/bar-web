import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { FeeLogModel } from '../../models/feelog.model';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';

@Component({
  selector: 'app-feelogedit',
  templateUrl: './feelogedit.component.html',
  providers: [PaymentslogService, PaymenttypeService],
  styleUrls: ['./feelogedit.component.css']
})
export class FeelogeditComponent implements OnInit {
  loadedId: string;
  model: FeeLogModel = new FeeLogModel();
  modalOn = false;
  returnModalOn = false;
  caseNumberModel = '';
  openedTab = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private paymentLogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private location: Location) { }

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
    console.log( this.model );
    try {
      this.model.status = 'D';
      this.toggleReturnModal();

      // redirect to feelog list
      return this.router.navigateByUrl('/feelog');
    } catch (exception) {
      console.log( exception );
    }
  }

}
