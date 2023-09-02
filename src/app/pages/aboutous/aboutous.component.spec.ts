import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutousComponent } from './aboutous.component';

describe('AboutousComponent', () => {
  let component: AboutousComponent;
  let fixture: ComponentFixture<AboutousComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutousComponent]
    });
    fixture = TestBed.createComponent(AboutousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
