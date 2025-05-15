import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingResetDataComponent } from './setting-reset-data.component';

describe('SettingResetDataComponent', () => {
  let component: SettingResetDataComponent;
  let fixture: ComponentFixture<SettingResetDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingResetDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingResetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
