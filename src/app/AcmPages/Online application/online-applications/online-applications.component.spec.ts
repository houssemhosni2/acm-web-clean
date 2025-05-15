import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineApplicationsComponent } from './online-applications.component';

describe('OnlineApplicationsComponent', () => {
  let component: OnlineApplicationsComponent;
  let fixture: ComponentFixture<OnlineApplicationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
