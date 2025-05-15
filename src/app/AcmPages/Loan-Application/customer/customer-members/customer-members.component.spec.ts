import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerMembersComponent } from './customer-members.component';

describe('CustomerMembersComponent', () => {
  let component: CustomerMembersComponent;
  let fixture: ComponentFixture<CustomerMembersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
