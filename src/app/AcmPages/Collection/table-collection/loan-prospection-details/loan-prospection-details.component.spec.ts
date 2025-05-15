import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanProspectionDetailsComponent } from './loan-prospection-details.component';

describe('LoanProspectionDetailsComponent', () => {
  let component: LoanProspectionDetailsComponent;
  let fixture: ComponentFixture<LoanProspectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanProspectionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanProspectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
