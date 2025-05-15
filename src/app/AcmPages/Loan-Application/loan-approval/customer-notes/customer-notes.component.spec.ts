import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CustomerNotesComponent} from './customer-notes.component';

describe('CustomerNotesComponent', () => {
  let component: CustomerNotesComponent;
  let fixture: ComponentFixture<CustomerNotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerNotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
