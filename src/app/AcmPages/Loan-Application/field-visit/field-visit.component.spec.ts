import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FieldVisitComponent} from './field-visit.component';

describe('FieldVisitComponent', () => {
  let component: FieldVisitComponent;
  let fixture: ComponentFixture<FieldVisitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldVisitComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
