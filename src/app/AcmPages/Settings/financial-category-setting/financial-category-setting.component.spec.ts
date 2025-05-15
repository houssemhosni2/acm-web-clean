import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCategorySettingComponent } from './financial-category-setting.component';

describe('FinancialCategorySettingComponent', () => {
  let component: FinancialCategorySettingComponent;
  let fixture: ComponentFixture<FinancialCategorySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialCategorySettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCategorySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
