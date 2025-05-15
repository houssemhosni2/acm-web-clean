import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingIscoreAmlComponent } from './setting-iscore-aml.component';

describe('SettingIscoreAmlComponent', () => {
  let component: SettingIscoreAmlComponent;
  let fixture: ComponentFixture<SettingIscoreAmlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingIscoreAmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingIscoreAmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
