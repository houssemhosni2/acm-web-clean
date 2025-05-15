import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerMessageComponent } from './customer-message.component';

describe('CustomerMessageComponent', () => {
  let component: CustomerMessageComponent;
  let fixture: ComponentFixture<CustomerMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
