import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallnotificationsComponent } from './callnotifications.component';

describe('CallnotificationsComponent', () => {
  let component: CallnotificationsComponent;
  let fixture: ComponentFixture<CallnotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallnotificationsComponent]
    });
    fixture = TestBed.createComponent(CallnotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
