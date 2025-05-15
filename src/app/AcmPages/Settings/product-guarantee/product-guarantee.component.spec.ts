import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGuaranteeComponent } from './product-guarantee.component';

describe('ProductGuaranteeComponent', () => {
  let component: ProductGuaranteeComponent;
  let fixture: ComponentFixture<ProductGuaranteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGuaranteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
