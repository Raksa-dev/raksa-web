import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Astrologer } from 'src/app/core/models';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
})
export class LiveComponent {
  constructor(
    private modalService: NgbModal,
    public userService: UserService
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
  async openPaymentForm() {
    // (await this.userService.GetCcavenuePaymentForm()).subscribe(
    //   (data: string) => {
    //     let child = window.open('about:blank', 'myChild');
    //     child.document.write(data);
    //     child.document.close();
    //   }
    // );
  }
}
