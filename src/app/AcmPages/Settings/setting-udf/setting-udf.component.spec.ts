import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingUdfComponent } from './setting-udf.component';

describe('SettingUdfComponent', () => {
  let component: SettingUdfComponent;
  let fixture: ComponentFixture<SettingUdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingUdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingUdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
