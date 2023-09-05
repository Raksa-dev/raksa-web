import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './shared/login/login.component';
import { ProfileComponent } from './shared/profile/profile.component';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Raksa';
  public isScrolled: boolean;

  public formStep: number = 1;
  public selectedCountry: number = 1;
  public showHeader: boolean = true;
  public showFooter: boolean = true;

  public otpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    localStorage.removeItem('user-sign-up-data');
    localStorage.removeItem('relative-data');
    this.activatedRoute.queryParams.subscribe((params) => {
      let routesArray = window.location?.pathname?.split('/');
      if (routesArray.includes('transaction')) {
        console.log('thisis is transcation');
        this.showHeader = false;
        this.showFooter = false;
        // redirect to transaction page
        // this.router.navigateByUrl('/transaction');
      }
      console.log('this insroutes arayy :', routesArray);
      if (params['code'] && params['code'].length == 6) {
        const modalRef = this.modalService.open(LoginComponent, {
          backdrop: 'static',
          keyboard: false,
          centered: true,
          size: 'lg',
          modalDialogClass: 'login',
        });
      }
    });
  }

  login(): void {
    const modalRef = this.modalService.open(LoginComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      modalDialogClass: 'login',
    });

    modalRef.result.then((res) => {
      if (res['response']) {
        // this.getAcademicSessions();
        // this.switchAcademicSession(res['data']);
      }
    });
  }

  openProfileModal(): void {
    const modalRef = this.modalService.open(ProfileComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }
  logout(): void {
    this.authService.SignOut();
  }
}
