/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GenericWfUnassignedTableComponent } from './generic-wf-unassigned-table.component';

describe('GenericWfUnassignedTableComponent', () => {
  let component: GenericWfUnassignedTableComponent;
  let fixture: ComponentFixture<GenericWfUnassignedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericWfUnassignedTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericWfUnassignedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
