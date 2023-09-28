import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HOROSCOPESDATA } from 'src/app/constants/horoscopes';
import { AuthService } from 'src/app/core/services';

const MONTHLYDATAHEADERS = [
  'Overview',
  'Business',
  'Career',
  'Finance',
  'Health',
  'Love and Reltionships',
  'Professional',
  'Student',
];

const YEARLY = ['Horoscope', 'education', 'money', 'health', 'love', 'career'];

@Component({
  selector: 'app-horoscope',
  templateUrl: './horoscope.component.html',
  styleUrls: ['./horoscope.component.scss'],
})
export class HoroscopeComponent implements OnInit {
  public zodiacBasicData;
  public selectedTab = 1;
  public monthlyDataSelected: number = 1;
  public yearlyDataSelected: number = 1;
  public showdate;
  public description = '';
  public dailyZodiacData: object = {};
  public monthlyDataCache: object = {};
  public yearlyDataCache: object = {};
  constructor(
    public activateRoute: ActivatedRoute,
    public authServices: AuthService
  ) {}
  async fetchDailyData(zodiac) {
    var date = new Date();

    // Get year, month, and day part from the date
    var year = date.toLocaleString('default', { year: 'numeric' });
    var month = date.toLocaleString('default', { month: '2-digit' });
    var day = date.toLocaleString('default', { day: '2-digit' });

    // Generate yyyy-mm-dd date string
    var formattedDate = year + '-' + month + '-' + day;
    const data = (
      await this.authServices.getDailyHoroscope(zodiac, formattedDate)
    ).subscribe((datum) => {
      this.description = datum[0]?.description;
      this.dailyZodiacData = { ...datum[0] };
    });
  }
  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params: ParamMap) => {
      const find = HOROSCOPESDATA.find(
        (data) => data.name == params.get('zodiac')
      );
      this.zodiacBasicData = find;
      if (this.selectedTab == 1) {
        this.setSelectTab(1);
        this.fetchDailyData(params.get('zodiac'));
      }
    });
  }

  async setSelectTab(num) {
    this.selectedTab = num;
    this.monthlyDataSelected = 1;
    this.yearlyDataSelected = 1;
    if (num == 1) {
      this.showdate = new Date().toDateString();
      this.fetchDailyData(this.zodiacBasicData.name);
    }
    if (num == 2) {
      let month = new Date();
      this.showdate = month.toLocaleString('default', { month: 'long' });
      (
        await this.authServices.getMonthlyHoroscope(
          this.zodiacBasicData.name.toLowerCase(),
          this.showdate.toLowerCase()
        )
      ).subscribe((datum) => {
        this.description = datum[0]?.Overview;
        this.monthlyDataCache = { ...datum[0] };
      });
    }
    if (num == 3) {
      this.showdate = '' + new Date().getFullYear();
      (
        await this.authServices.getYearlyHoroscope(
          this.zodiacBasicData.name.toLowerCase()
        )
      ).subscribe((datum) => {
        this.description = datum[0]?.Horoscope;
        this.yearlyDataCache = { ...datum[0] };
      });
    }
  }
  async setMonthlyDataSelected(num) {
    this.monthlyDataSelected = num;
    this.description = this.monthlyDataCache[MONTHLYDATAHEADERS[num - 1]];
  }
  async setYearlyDataSelected(num) {
    this.yearlyDataSelected = num;
    this.description = this.yearlyDataCache[YEARLY[num - 1]];
  }
}
