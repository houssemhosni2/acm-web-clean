import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerGroupeDashbordComponent } from './customer-groupe-dashbord.component';

describe('CustomerGroupeDashbordComponent', () => {
  let component: CustomerGroupeDashbordComponent;
  let fixture: ComponentFixture<CustomerGroupeDashbordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupeDashbordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupeDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
