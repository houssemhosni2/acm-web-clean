import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingNotificationComponent } from './setting-notification.component';

describe('SettingNotificationComponent', () => {
  let component: SettingNotificationComponent;
  let fixture: ComponentFixture<SettingNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
