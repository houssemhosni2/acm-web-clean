import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInformationLoanComponent } from './other-information-loan.component';

describe('OtherInformationLoanComponent', () => {
  let component: OtherInformationLoanComponent;
  let fixture: ComponentFixture<OtherInformationLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherInformationLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherInformationLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
