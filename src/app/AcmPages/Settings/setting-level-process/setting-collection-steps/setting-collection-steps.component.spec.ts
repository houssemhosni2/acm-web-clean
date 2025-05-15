/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCollectionStepsComponent } from './setting-collection-steps.component';

describe('SettingCollectionStepsComponent', () => {
  let component: SettingCollectionStepsComponent;
  let fixture: ComponentFixture<SettingCollectionStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingCollectionStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingCollectionStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
