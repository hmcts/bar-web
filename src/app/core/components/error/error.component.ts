import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  template: '<h1 class="heading-xlarge">{{errorMessage}}</h1>'
})

export class ErrorComponent implements OnInit {
  errorMessage: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.errorMessage = this.findErrorMessage(params.errorCode);
    });
  }

  findErrorMessage(code: string): string {
    console.log('code: ' + code);
    switch (code) {
      case '401':
        return 'Access denied';
      case '403':
        return 'Forbidden';
      case '404':
        return 'Document not found';
      default:
        return 'Application error';
    }
  }
}
