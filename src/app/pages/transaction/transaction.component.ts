import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import * as crypto from 'crypto-js';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  public trasactionStatus: Boolean;
  constructor(
    public activateRoute: ActivatedRoute,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.activateRoute.queryParams.subscribe((params) => {
      if (params['type'] == 'success') {
        this.trasactionStatus = true;
        var bytes = crypto.AES.decrypt(
          params['val'].replace(/ /g, '+'),
          'Astro'
        );
        var decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
        const getUserId = decryptedData.order_id.split('_');
        this.userService
          .updateUserWalletAmount(Number(decryptedData.amount), getUserId[2])
          .then((data) => {
            console.log('this is data:', data);
          });
      } else {
        this.trasactionStatus = false;
        var bytes = crypto.AES.decrypt(
          params['val'].replace(/ /g, '+'),
          'Astro'
        );
        var decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
        console.log(decryptedData);
        const getUserId = decryptedData.order_id.split('_');
        this.userService
          .updateUserWalletAmount(Number(decryptedData.amount), getUserId[2])
          .then((data) => {
            console.log('this is data:', data);
          });
      }
    });
  }
}
