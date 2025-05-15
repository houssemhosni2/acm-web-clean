import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCollectionDetailsComponent } from './loan-collection-details.component';

describe('LoanCollectionDetailsComponent', () => {
  let component: LoanCollectionDetailsComponent;
  let fixture: ComponentFixture<LoanCollectionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanCollectionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCollectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
