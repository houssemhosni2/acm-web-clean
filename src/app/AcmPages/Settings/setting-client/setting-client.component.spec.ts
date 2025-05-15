import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingClientComponent } from './setting-client.component';

describe('SettingClientComponent', () => {
  let component: SettingClientComponent;
  let fixture: ComponentFixture<SettingClientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
