import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompleteDataComponent } from './complete-data.component';

describe('CompleteDataComponent', () => {
  let component: CompleteDataComponent;
  let fixture: ComponentFixture<CompleteDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
