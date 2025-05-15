import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineApplicationsInfoComponent } from './online-applications-info.component';

describe('OnlineApplicationsInfoComponent', () => {
  let component: OnlineApplicationsInfoComponent;
  let fixture: ComponentFixture<OnlineApplicationsInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineApplicationsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineApplicationsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
