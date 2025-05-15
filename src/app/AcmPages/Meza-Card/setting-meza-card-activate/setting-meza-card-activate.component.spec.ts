import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingMezaCardActivateComponent } from './setting-meza-card-activate.component';

describe('SettingMezaCardActivateComponent', () => {
  let component: SettingMezaCardActivateComponent;
  let fixture: ComponentFixture<SettingMezaCardActivateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingMezaCardActivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingMezaCardActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
