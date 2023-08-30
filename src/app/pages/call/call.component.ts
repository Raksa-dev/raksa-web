import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Astrologer } from 'src/app/core/models';
import { HMSReactiveStore } from '@100mslive/hms-video-store';
import { AuthService } from 'src/app/core/services';
import { LoginComponent } from 'src/app/shared/login/login.component';
import { CalluiComponent } from 'src/app/shared/callui/callui.component';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent  {
  constructor(
    private modalService: NgbModal,
    public authService: AuthService
  ) {}

  public astrologers: Astrologer[] = [
    {
      _id: 1,
      avatar: '../../../assets/images/astrologer/avatar-1.png',
      astrologerName: 'Pandit Pradeep',
      experience: '10+ years of experience',
      tags: 'Palm reading, Tarrot Cards, Numerology',
      rating: 4.5,
      reviews: 1000,
      online: true,
    },
    {
      _id: 2,
      avatar: '../../../assets/images/astrologer/avatar-2.png',
      astrologerName: 'Yadav Raj',
      experience: '30+ years of experience',
      tags: 'Vedic astrologer, Vastu expert',
      rating: 4.5,
      reviews: 2500,
      online: false,
    },
    {
      _id: 3,
      avatar: '../../../assets/images/astrologer/avatar-3.png',
      astrologerName: 'Pandit Pradeep',
      experience: '10+ years of experience',
      tags: 'Palm reading, Tarrot Cards, Numerology',
      rating: 4.5,
      reviews: 1000,
      online: true,
    },
    {
      _id: 4,
      avatar: '../../../assets/images/astrologer/avatar-4.png',
      astrologerName: 'Yadav Raj',
      experience: '30+ years of experience',
      tags: 'Vedic astrologer, Vastu expert',
      rating: 4.5,
      reviews: 2500,
      online: true,
    },
    {
      _id: 5,
      avatar: '../../../assets/images/astrologer/avatar-5.png',
      astrologerName: 'Pandit Pradeep',
      experience: '10+ years of experience',
      tags: 'Palm reading, Tarrot Cards, Numerology',
      rating: 4.5,
      reviews: 1000,
      online: true,
    },
    {
      _id: 6,
      avatar: '../../../assets/images/astrologer/avatar-6.png',
      astrologerName: 'Yadav Raj',
      experience: '30+ years of experience',
      tags: 'Vedic astrologer, Vastu expert',
      rating: 4.5,
      reviews: 2500,
      online: false,
    },
    {
      _id: 7,
      avatar: '../../../assets/images/astrologer/avatar-7.png',
      astrologerName: 'Pandit Pradeep',
      experience: '10+ years of experience',
      tags: 'Palm reading, Tarrot Cards, Numerology',
      rating: 4.5,
      reviews: 1000,
      online: true,
    },
    {
      _id: 8,
      avatar: '../../../assets/images/astrologer/avatar-1.png',
      astrologerName: 'Yadav Raj',
      experience: '30+ years of experience',
      tags: 'Vedic astrologer, Vastu expert',
      rating: 4.5,
      reviews: 2500,
      online: true,
    },
  ];

  public openFilter(content: any): void {
    const modalRef = this.modalService
      .open(content, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
  public openCallModal() {
    if (this.authService.activeUserValue) {
      this.modalService.open(CalluiComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      });
    } else {
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        modalDialogClass: 'login',
      });
    }
  }
}
