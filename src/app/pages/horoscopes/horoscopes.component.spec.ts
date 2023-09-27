import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoroscopesComponent } from './horoscopes.component';

describe('HoroscopesComponent', () => {
  let component: HoroscopesComponent;
  let fixture: ComponentFixture<HoroscopesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoroscopesComponent]
    });
    fixture = TestBed.createComponent(HoroscopesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
