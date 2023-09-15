import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-astrologer',
  templateUrl: './astrologer.component.html',
  styleUrls: ['./astrologer.component.scss'],
})
export class AstrologerComponent implements OnInit {
  ngOnInit(): void {
    if (localStorage.getItem('astrologerScreen') == 'true') {
      window.location.reload();
      localStorage.removeItem('astrologerScreen');
    }
  }
}
