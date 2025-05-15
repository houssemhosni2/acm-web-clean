import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBlacklistComponent } from './setting-blacklist.component';

describe('SettingBlacklistComponent', () => {
  let component: SettingBlacklistComponent;
  let fixture: ComponentFixture<SettingBlacklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingBlacklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBlacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
