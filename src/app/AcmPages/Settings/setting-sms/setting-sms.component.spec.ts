import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSMSComponent } from './setting-sms.component';

describe('SettingSMSComponent', () => {
  let component: SettingSMSComponent;
  let fixture: ComponentFixture<SettingSMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingSMSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
