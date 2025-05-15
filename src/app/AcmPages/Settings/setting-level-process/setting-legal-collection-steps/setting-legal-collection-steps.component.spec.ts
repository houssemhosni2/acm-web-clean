/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingLegalCollectionStepsComponent } from './setting-legal-collection-steps.component';

describe('SettingLegalCollectionStepsComponent', () => {
  let component: SettingLegalCollectionStepsComponent;
  let fixture: ComponentFixture<SettingLegalCollectionStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingLegalCollectionStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingLegalCollectionStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
