import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAmlCheckAndDoubtfulTxComponent } from './setting-aml-check-and-doubtful-tx.component';

describe('SettingAmlCheckAndDoubtfulTxComponent', () => {
  let component: SettingAmlCheckAndDoubtfulTxComponent;
  let fixture: ComponentFixture<SettingAmlCheckAndDoubtfulTxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingAmlCheckAndDoubtfulTxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAmlCheckAndDoubtfulTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
