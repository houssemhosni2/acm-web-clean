import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerRelationshipComponent } from './customer-relationship.component';

describe('CustomerRelationshipComponent', () => {
  let component: CustomerRelationshipComponent;
  let fixture: ComponentFixture<CustomerRelationshipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
