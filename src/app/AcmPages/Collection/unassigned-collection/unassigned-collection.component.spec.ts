import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedCollectionComponent } from './unassigned-collection.component';

describe('UnassignedCollectionComponent', () => {
  let component: UnassignedCollectionComponent;
  let fixture: ComponentFixture<UnassignedCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnassignedCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassignedCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
