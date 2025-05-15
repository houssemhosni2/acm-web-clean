import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingLevelComponent } from './setting-level.component';

describe('SettingLevelComponent', () => {
  let component: SettingLevelComponent;
  let fixture: ComponentFixture<SettingLevelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
