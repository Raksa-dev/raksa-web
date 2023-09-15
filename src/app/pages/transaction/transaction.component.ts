import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, TitleStrategy } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  public trasactionStatus: Boolean;
  constructor(public activateRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activateRoute.queryParams.subscribe((params) => {
      if (params['type'] == 'success') {
        this.trasactionStatus = true;
      } else {
        this.trasactionStatus = false;
      }
    });
  }
}
