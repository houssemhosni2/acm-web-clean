import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericWfTableComponent } from './generic-wf-table.component';

describe('GenericWfTableComponent', () => {
  let component: GenericWfTableComponent;
  let fixture: ComponentFixture<GenericWfTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericWfTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericWfTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
