import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingMezaCardComponent } from './setting-meza-card.component';

describe('SettingMezaCardComponent', () => {
  let component: SettingMezaCardComponent;
  let fixture: ComponentFixture<SettingMezaCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingMezaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingMezaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
