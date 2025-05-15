import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLineReportsComponent } from './credit-line-reports.component';

describe('CreditLineReportsComponent', () => {
  let component: CreditLineReportsComponent;
  let fixture: ComponentFixture<CreditLineReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditLineReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLineReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
