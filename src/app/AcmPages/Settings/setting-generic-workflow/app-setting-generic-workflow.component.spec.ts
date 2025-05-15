/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppSettingGenericWorkflowComponent } from './app-setting-generic-workflow.component';

describe('AppSettingGenericWorkflowComponent', () => {
  let component: AppSettingGenericWorkflowComponent;
  let fixture: ComponentFixture<AppSettingGenericWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSettingGenericWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSettingGenericWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
