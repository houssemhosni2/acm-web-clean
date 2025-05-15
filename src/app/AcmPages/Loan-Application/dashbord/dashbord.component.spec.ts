import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DashbordComponent} from './dashbord.component';

xdescribe('TasksComponent', () => {
  let component: DashbordComponent;
  let fixture: ComponentFixture<DashbordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashbordComponent],
      schemas: [NO_ERRORS_SCHEMA]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
