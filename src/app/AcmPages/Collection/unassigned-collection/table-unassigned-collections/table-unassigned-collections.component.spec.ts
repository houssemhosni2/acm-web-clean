import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableUnassignedCollectionsComponent } from './table-unassigned-collections.component';

describe('TableUnassignedCollectionsComponent', () => {
  let component: TableUnassignedCollectionsComponent;
  let fixture: ComponentFixture<TableUnassignedCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableUnassignedCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableUnassignedCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
