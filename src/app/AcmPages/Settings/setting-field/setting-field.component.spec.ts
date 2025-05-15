import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingFieldComponent } from './setting-field.component';

describe('SettingFieldComponent', () => {
  let component: SettingFieldComponent;
  let fixture: ComponentFixture<SettingFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
