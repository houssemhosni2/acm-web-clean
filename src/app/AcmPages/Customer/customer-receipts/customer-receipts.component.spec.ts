import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReceiptsComponent } from './customer-receipts.component';

describe('CustomerReceiptsComponent', () => {
  let component: CustomerReceiptsComponent;
  let fixture: ComponentFixture<CustomerReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
