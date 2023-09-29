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
      var bytes = crypto.AES.decrypt(params['val'].replace(/ /g, '+'), 'Astro');
      var decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
      console.log('this is decrpted data', decryptedData);
      // const getUserId = decryptedData.order_id.split('_');
      if (params['type'] == 'success') {
        this.onSuccess(params, decryptedData);
      } else {
        this.onInvalid(params, decryptedData);
      }
    });
  }
  async onSuccess(params, decryptedData) {
    this.trasactionStatus = true;
    const trasactionId =
      decryptedData['transactionId'] || decryptedData['order_id'];
    const checkForTrax = await this.userService.checkForTrx(trasactionId);

    if (checkForTrax) {
      return;
    }
    if (params['pg'] == 'phonepe') {
      // handle phone pe
      const getUserId = decryptedData.transactionId.split('_');
      this.userService
        .updateUserWalletAmount(
          Number(decryptedData.amount),
          getUserId[2],
          decryptedData['transactionId'],
          decryptedData['providerReferenceId'],
          decryptedData['message'],
          'Success',
          decryptedData['message']
        )
        .then((data) => {
          console.log('this is data:', data);
        });
    } else {
      // handle ccavenu
      const getUserId = decryptedData.order_id.split('_');

      this.userService
        .updateUserWalletAmount(
          Number(decryptedData.amount),
          getUserId[2],
          decryptedData['order_id'],
          decryptedData['tracking_id'],
          decryptedData['failure_message'],
          decryptedData['order_status'],
          decryptedData['status_message']
        )
        .then((data) => {
          console.log('this is data:', data);
        });
    }
  }
  async onInvalid(params, decryptedData) {
    this.trasactionStatus = false;
    const trasactionId =
      decryptedData['transactionId'] || decryptedData['order_id'];
    const checkForTrax = await this.userService.checkForTrx(trasactionId);

    if (checkForTrax) {
      return;
    }

    if (params['pg'] == 'phonepe') {
      const getUserId = decryptedData.transactionId.split('_');

      this.userService.updateUserWalletAmountForElse(
        Number(decryptedData.amount),
        getUserId[2],
        decryptedData['transactionId'],
        decryptedData['providerReferenceId'],
        decryptedData['message'],
        'Invalid',
        decryptedData['message']
      );
    } else {
      const getUserId = decryptedData.order_id.split('_');

      this.userService.updateUserWalletAmountForElse(
        Number(decryptedData.amount),
        getUserId[2],
        decryptedData['order_id'],
        decryptedData['tracking_id'],
        decryptedData['failure_message'],
        decryptedData['order_status'],
        decryptedData['status_message']
      );
    }
  }
}
