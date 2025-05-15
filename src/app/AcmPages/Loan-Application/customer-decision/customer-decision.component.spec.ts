import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CustomerDecisionComponent} from './customer-decision.component';

describe('CustomerDecisionComponent', () => {
  let component: CustomerDecisionComponent;
  let fixture: ComponentFixture<CustomerDecisionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerDecisionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
