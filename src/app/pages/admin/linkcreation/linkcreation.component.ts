import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserService } from 'src/app/core/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-linkcreation',
  templateUrl: './linkcreation.component.html',
  styleUrls: ['./linkcreation.component.scss'],
})
export class LinkcreationComponent {
  constructor(
    private userServices: UserService,
    public activeModal: NgbActiveModal
  ) {}

  link: string = '';
  code: string = '';

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
    let codeGenerate = this.randomString(6, 'a#A');
    const link = environment.LINK + '?code=' + codeGenerate;
    this.link = link;
    this.code = codeGenerate;
  }
  async copyLink() {
    navigator.clipboard.writeText(this.link);
    await this.userServices.AdminLinkCreation(this.code).then((data) => {
    });
    // Alert the copied text
    alert('Copied the text: ' + this.link);
  }
  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
