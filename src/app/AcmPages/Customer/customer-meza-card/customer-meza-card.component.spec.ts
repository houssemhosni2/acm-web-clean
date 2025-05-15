import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerMezaCardComponent } from './customer-meza-card.component';

describe('CustomerMezaCardComponent', () => {
  let component: CustomerMezaCardComponent;
  let fixture: ComponentFixture<CustomerMezaCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMezaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMezaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
