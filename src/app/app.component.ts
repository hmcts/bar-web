import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  // project phase type
  type = 'alpha';

  constructor () { }

  ngOnInit() {
  }

}
