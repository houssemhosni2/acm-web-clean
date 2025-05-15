import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCollectionHistoryComponent } from './customer-collection-history.component';

describe('CustomerCollectionHistoryComponent', () => {
  let component: CustomerCollectionHistoryComponent;
  let fixture: ComponentFixture<CustomerCollectionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCollectionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCollectionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
