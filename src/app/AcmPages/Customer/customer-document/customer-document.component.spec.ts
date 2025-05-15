import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerDocumentComponent } from './customer-document.component';

describe('CustomerDocumentComponent', () => {
  let component: CustomerDocumentComponent;
  let fixture: ComponentFixture<CustomerDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
