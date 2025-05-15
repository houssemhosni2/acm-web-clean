import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanLegalDetailsComponent } from './loan-legal-details.component';

describe('LoanLegalDetailsComponent', () => {
  let component: LoanLegalDetailsComponent;
  let fixture: ComponentFixture<LoanLegalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanLegalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanLegalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
