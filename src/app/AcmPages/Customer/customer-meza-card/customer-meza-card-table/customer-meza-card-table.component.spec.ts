import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerMezaCardTableComponent } from './customer-meza-card-table.component';

describe('CustomerMezaCardTableComponent', () => {
  let component: CustomerMezaCardTableComponent;
  let fixture: ComponentFixture<CustomerMezaCardTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMezaCardTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMezaCardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
