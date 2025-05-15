import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTypeRiskComponent } from './setting-type-risk.component';

describe('SettingTypeRiskComponent', () => {
  let component: SettingTypeRiskComponent;
  let fixture: ComponentFixture<SettingTypeRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingTypeRiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingTypeRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
