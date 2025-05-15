/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GenericWorkFlowDocumentComponent } from './generic-workFlow-document.component';

describe('GenericWorkFlowDocumentComponent', () => {
  let component: GenericWorkFlowDocumentComponent;
  let fixture: ComponentFixture<GenericWorkFlowDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericWorkFlowDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericWorkFlowDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
