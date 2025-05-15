import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompleteDataLoanComponent } from './complete-data-loan.component';

describe('CompleteDataLoanComponent', () => {
  let component: CompleteDataLoanComponent;
  let fixture: ComponentFixture<CompleteDataLoanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteDataLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteDataLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
