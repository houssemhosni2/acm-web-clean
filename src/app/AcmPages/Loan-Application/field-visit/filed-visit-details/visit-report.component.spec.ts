import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {VisitReportComponent} from './visit-report.component';

describe('VisitReportComponent', () => {
  let component: VisitReportComponent;
  let fixture: ComponentFixture<VisitReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VisitReportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
