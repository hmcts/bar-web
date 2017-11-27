import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-instructions',
  templateUrl: './payment-instructions.component.html',
  styleUrls: ['./payment-instructions.component.css']
})
export class PaymentInstructionsComponent implements OnInit {

  fieldSelected = false;
  selectAllPosts = false;
  posts: any = [
    { id: 123451, date: Date.now(), payer_name: 'James Scales', payment_type: 'Cheque', selected: false },
    { id: 123452, date: Date.now(), payer_name: 'Leonard Oakley', payment_type: 'Cash', selected: false },
    { id: 123453, date: Date.now(), payer_name: 'Irene Lakely', payment_type: 'Cheque', selected: false },
    { id: 123454, date: Date.now(), payer_name: 'Robert Parsley', payment_type: 'Postal Order', selected: false },
    { id: 123455, date: Date.now(), payer_name: 'Jane Black', payment_type: 'Cheque', selected: false },
    { id: 123456, date: Date.now(), payer_name: 'Diane Leatherway', payment_type: 'Cash', selected: false }
  ];

  constructor() { }

  ngOnInit() {

  }

  onAlterCheckedState(post): void {
    const currentPost = this.posts.findIndex(thisPost => {
      return post === thisPost;
    });
    this.posts[currentPost].selected = !this.posts[currentPost].selected;
    this.fieldSelected = this.hasSelectedFields();
  }

  onSelectAllPosts(): void {
    this.selectAllPosts = !this.selectAllPosts;

    for (let i = 0; i < this.posts.length; i++) {
      this.posts[i].selected = this.selectAllPosts;
    }

    this.fieldSelected = this.hasSelectedFields();
  }

  private hasSelectedFields(): boolean {
    let selectedFields = false;
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].selected) {
        selectedFields = true;
        break;
      }
    }

    return selectedFields;
  }

}
