import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RunIncentiveComponent } from './run-incentive.component';

describe('RunIncentiveComponent', () => {
  let component: RunIncentiveComponent;
  let fixture: ComponentFixture<RunIncentiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RunIncentiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
