import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FinancialAnalysisDetailsComponent} from './financial-analysis-details.component';

describe('FinancialAnalysisDetailsComponent', () => {
  let component: FinancialAnalysisDetailsComponent;
  let fixture: ComponentFixture<FinancialAnalysisDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialAnalysisDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAnalysisDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
