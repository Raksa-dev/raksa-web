import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstrologerComponent } from './astrologer.component';

describe('AstrologerComponent', () => {
  let component: AstrologerComponent;
  let fixture: ComponentFixture<AstrologerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AstrologerComponent]
    });
    fixture = TestBed.createComponent(AstrologerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
