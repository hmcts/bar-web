import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FeeLogModel } from '../../models/feelog.model';
import { NavigationTrackerService } from '../../services/navigationtracker/navigation-tracker.service';

@Component({
  selector: 'app-feelogedit',
  templateUrl: './feelogedit.component.html',
  styleUrls: ['./feelogedit.component.css']
})
export class FeelogeditComponent implements OnInit {
  loadedId: string;
  model: FeeLogModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private navigationTrackerService: NavigationTrackerService) { }

  ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    // set the color of the navigation
    this.navigationTrackerService.setNavigationColor('white');

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
  }

}
