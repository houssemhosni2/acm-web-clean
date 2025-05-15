import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnassignedTableComponent } from './unassigned-table.component';

describe('UnassignedTableComponent', () => {
  let component: UnassignedTableComponent;
  let fixture: ComponentFixture<UnassignedTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnassignedTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassignedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
