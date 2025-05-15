import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingProspectionStepsComponent } from './setting-prospection-steps.component';

describe('SettingProspectionStepsComponent', () => {
  let component: SettingProspectionStepsComponent;
  let fixture: ComponentFixture<SettingProspectionStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingProspectionStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingProspectionStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
