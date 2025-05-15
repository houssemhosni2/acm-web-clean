import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineApplicationAssignComponent } from './online-applications-assign.component';

describe('OnlineApplicationAssignComponent', () => {
  let component: OnlineApplicationAssignComponent;
  let fixture: ComponentFixture<OnlineApplicationAssignComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineApplicationAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineApplicationAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
