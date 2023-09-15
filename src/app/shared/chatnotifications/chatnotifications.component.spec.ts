import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatnotificationsComponent } from './chatnotifications.component';

describe('ChatnotificationsComponent', () => {
  let component: ChatnotificationsComponent;
  let fixture: ComponentFixture<ChatnotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatnotificationsComponent]
    });
    fixture = TestBed.createComponent(ChatnotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
