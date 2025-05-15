import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericWorkFlowScreenComponent } from './generic-work-flow-screen.component';

describe('GenericWorkFlowScreenComponent', () => {
  let component: GenericWorkFlowScreenComponent;
  let fixture: ComponentFixture<GenericWorkFlowScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericWorkFlowScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericWorkFlowScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
