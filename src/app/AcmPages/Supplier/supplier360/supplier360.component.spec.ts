/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Supplier360Component } from './supplier360.component';

describe('Supplier360Component', () => {
  let component: Supplier360Component;
  let fixture: ComponentFixture<Supplier360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Supplier360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Supplier360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
