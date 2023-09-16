import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Auth } from 'firebase/auth';
import {
  AuthService,
  UserService,
  WindowRefService,
} from 'src/app/core/services';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder
  ) {}
  public addMoneyForm: FormGroup = this.formBuilder.group({
    amount: [null, [Validators.required]],
  });
  public currentUser = this.userService.getUserData;

  ngOnInit(): void {}
  async submitAmountDetailsForm() {
    const formValues = this.addMoneyForm.value;
    (
      await this.userService.GetCcavenuePaymentForm(
        formValues.amount,
        this.currentUser['uid']
      )
    ).subscribe((data: string) => {
      let child = window.open('about:blank', 'myChild');
      child.document.write(data);
      child.document.close();
      this.activeModal.close({ response: false });
    });
  }

  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
