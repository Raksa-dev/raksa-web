import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeTimePickerComponent } from './custome-time-picker.component';

describe('CustomeTimePickerComponent', () => {
  let component: CustomeTimePickerComponent;
  let fixture: ComponentFixture<CustomeTimePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomeTimePickerComponent]
    });
    fixture = TestBed.createComponent(CustomeTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
