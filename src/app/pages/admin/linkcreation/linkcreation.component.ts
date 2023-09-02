import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-linkcreation',
  templateUrl: './linkcreation.component.html',
  styleUrls: ['./linkcreation.component.scss'],
})
export class LinkcreationComponent {
  link: string = '';

  randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i)
      result += mask[Math.floor(Math.random() * mask.length)];
    return result;
  }

  generateLink() {
    const link =
      environment.LINK + '/form' + '?code=' + this.randomString(6, 'a#A');
    this.link = link;
  }
  copyLink() {
    navigator.clipboard.writeText(this.link);

    // Alert the copied text
    alert('Copied the text: ' + this.link);
  }
}
