import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingMezaCardSendComponent } from './setting-meza-card-send.component';

describe('SettingMezaCardSendComponent', () => {
  let component: SettingMezaCardSendComponent;
  let fixture: ComponentFixture<SettingMezaCardSendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingMezaCardSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingMezaCardSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
