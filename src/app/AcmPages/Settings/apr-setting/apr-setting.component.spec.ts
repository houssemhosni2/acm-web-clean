import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprSettingComponent } from './apr-setting.component';

describe('AprSettingComponent', () => {
  let component: AprSettingComponent;
  let fixture: ComponentFixture<AprSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
