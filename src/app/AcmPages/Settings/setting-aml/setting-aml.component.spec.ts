import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingAmlComponent } from './setting-aml.component';

describe('SettingAmlComponent', () => {
  let component: SettingAmlComponent;
  let fixture: ComponentFixture<SettingAmlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingAmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
