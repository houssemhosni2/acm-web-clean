import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DabshbordTableComponent} from './dabshbord-table.component';

describe('DabshbordTableComponent', () => {
  let component: DabshbordTableComponent;
  let fixture: ComponentFixture<DabshbordTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DabshbordTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DabshbordTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
