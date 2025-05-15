import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnalyticComponent } from './analytic.component';

describe('AnalyticComponent', () => {
  let component: AnalyticComponent;
  let fixture: ComponentFixture<AnalyticComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
