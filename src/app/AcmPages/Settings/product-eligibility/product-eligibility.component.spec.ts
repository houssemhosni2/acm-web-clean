import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEligibilityComponent } from './product-eligibility.component';

describe('ProductEligibilityComponent', () => {
  let component: ProductEligibilityComponent;
  let fixture: ComponentFixture<ProductEligibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductEligibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
