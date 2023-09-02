import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Astrologer } from 'src/app/core/models';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';
import { LinkcreationComponent } from './linkcreation/linkcreation.component';
import { AuthService, UserService } from 'src/app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    public router: Router,
    public userServices: UserService
  ) {}

  ngOnInit() {
    if (!this.authService.activeUserValue) {
      this.router.navigateByUrl('/');
    } else {
      this.userServices
        .getDataFromUserCollection(this.authService.activeUserValue['uid'])
        .then((data) => {
          if (data && data['user_type'] != 'admin') {
            this.router.navigateByUrl('/');
          }
        });
    }
  }

  public items: any[] = [
    {
      itemName: 'Blogs',
    },
    {
      itemName: 'Astro Link',
    },
  ];

  showlinkgenerationModal() {
    const modalRef = this.modalService.open(LinkcreationComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }
}
