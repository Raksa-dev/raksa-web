import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactousComponent } from './contactous.component';

describe('ContactousComponent', () => {
  let component: ContactousComponent;
  let fixture: ComponentFixture<ContactousComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactousComponent]
    });
    fixture = TestBed.createComponent(ContactousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
