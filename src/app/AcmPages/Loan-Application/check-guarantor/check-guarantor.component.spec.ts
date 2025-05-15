import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CheckGuarantorComponent} from './check-guarantor.component';

describe('CheckGuarantorComponent', () => {
  let component: CheckGuarantorComponent;
  let fixture: ComponentFixture<CheckGuarantorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CheckGuarantorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
