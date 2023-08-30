import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalluiComponent } from './callui.component';

describe('CalluiComponent', () => {
  let component: CalluiComponent;
  let fixture: ComponentFixture<CalluiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalluiComponent]
    });
    fixture = TestBed.createComponent(CalluiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
