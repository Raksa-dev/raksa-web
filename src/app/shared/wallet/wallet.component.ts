import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
export class WalletComponent {
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder
  ) {}
  public currentUser = this.userService.getUserData;

  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
