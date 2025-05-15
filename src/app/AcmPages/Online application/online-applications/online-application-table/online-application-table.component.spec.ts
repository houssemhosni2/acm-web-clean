import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineApplicationTableComponent } from './online-application-table.component';

describe('OnlineApplicationTableComponent', () => {
  let component: OnlineApplicationTableComponent;
  let fixture: ComponentFixture<OnlineApplicationTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineApplicationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineApplicationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
