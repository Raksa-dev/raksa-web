import { Component } from '@angular/core';
import { HOROSCOPESDATA } from 'src/app/constants/horoscopes';

@Component({
  selector: 'app-horoscopes',
  templateUrl: './horoscopes.component.html',
  styleUrls: ['./horoscopes.component.scss'],
})
export class HoroscopesComponent {
  public horoscopesData = HOROSCOPESDATA;
}
