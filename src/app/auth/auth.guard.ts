import { inject } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../core/services';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../shared/login/login.component';

@Injectable()
export class authGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    authServices: AuthService,
    private modalService: NgbModal
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const hello = this.authService.activeUserValue;
    if (hello) {
      return true;
    }
    const modalRef = this.modalService.open(LoginComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      modalDialogClass: 'login',
    });
    return false;
  }
}
