import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingLevelProcessComponent } from './setting-level-process.component';

describe('SettingLevelProcessComponent', () => {
  let component: SettingLevelProcessComponent;
  let fixture: ComponentFixture<SettingLevelProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingLevelProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingLevelProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
