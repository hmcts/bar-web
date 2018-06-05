import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})

export class ErrorComponent implements OnInit {
  errorMessage: {
    h1: '',
    additional_info: ''
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.errorMessage = this.findErrorMessage(params.errorCode);
    });
  }

  findErrorMessage(code: string): any {
    console.log('code: ' + code);
    switch (code) {
      case '401':
        return { h1: 'This server could not verify that you are authorized to access the document requested' };
      case '403':
        return { h1: 'You do not have permission to retrieve the URL or link you requested' };
      case '404':
        return { h1: 'Sorry, but the page you were trying to view does not exist',
          additional_info : '<div>It looks like this was the result of either:</div>' +
            '<ul style=\'padding: 15px\'><li>a mistyped address</li><li>an out-of-date link</li></ul>'
        };
      default:
        return { h1: 'Application error' };
    }
  }
}
