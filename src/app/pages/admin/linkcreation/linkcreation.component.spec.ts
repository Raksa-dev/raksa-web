import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkcreationComponent } from './linkcreation.component';

describe('LinkcreationComponent', () => {
  let component: LinkcreationComponent;
  let fixture: ComponentFixture<LinkcreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkcreationComponent]
    });
    fixture = TestBed.createComponent(LinkcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
