import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegistrationIncentivesComponent } from './registration-incentives.component';

describe('RegistrationIncentivesComponent', () => {
  let component: RegistrationIncentivesComponent;
  let fixture: ComponentFixture<RegistrationIncentivesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationIncentivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationIncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
