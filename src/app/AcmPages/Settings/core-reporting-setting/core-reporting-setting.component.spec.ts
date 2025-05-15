import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreReportingSettingComponent } from './core-reporting-setting.component';

describe('CoreReportingSettingComponent', () => {
  let component: CoreReportingSettingComponent;
  let fixture: ComponentFixture<CoreReportingSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreReportingSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreReportingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
