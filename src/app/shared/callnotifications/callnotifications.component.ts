import { Component } from '@angular/core';

@Component({
  selector: 'app-callnotifications',
  templateUrl: './callnotifications.component.html',
  styleUrls: ['./callnotifications.component.scss'],
})
export class CallnotificationsComponent {
  onCancel() {
    console.log('this is call nofiication close button ');
  }
}
