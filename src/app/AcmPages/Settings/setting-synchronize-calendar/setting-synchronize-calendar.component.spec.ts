import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSynchronizeCalendarComponent } from './setting-synchronize-calendar.component';

describe('SettingSynchronizeCalendarComponent', () => {
  let component: SettingSynchronizeCalendarComponent;
  let fixture: ComponentFixture<SettingSynchronizeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingSynchronizeCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSynchronizeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
