import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingOfflineComponent } from './setting-offline.component';

describe('SettingOfflineComponent', () => {
  let component: SettingOfflineComponent;
  let fixture: ComponentFixture<SettingOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingOfflineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
