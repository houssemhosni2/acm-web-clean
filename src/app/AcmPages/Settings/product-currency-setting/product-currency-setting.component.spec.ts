import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCurrencySettingComponent } from './product-currency-setting.component';

describe('ProductCurrencySettingComponent', () => {
  let component: ProductCurrencySettingComponent;
  let fixture: ComponentFixture<ProductCurrencySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCurrencySettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCurrencySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
