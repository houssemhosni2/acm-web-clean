import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSettingThirdPartyComponent } from './add-setting-third-party.component';

describe('AddSettingThirdPartyComponent', () => {
  let component: AddSettingThirdPartyComponent;
  let fixture: ComponentFixture<AddSettingThirdPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSettingThirdPartyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSettingThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
