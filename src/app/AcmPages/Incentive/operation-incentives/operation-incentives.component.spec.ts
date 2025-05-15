import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OperationIncentivesComponent } from './operation-incentives.component';

describe('OperationIncentivesComponent', () => {
  let component: OperationIncentivesComponent;
  let fixture: ComponentFixture<OperationIncentivesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationIncentivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationIncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
