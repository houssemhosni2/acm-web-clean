import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsDocumentsComponent } from './collections-documents.component';

describe('CollectionsDocumentsComponent', () => {
  let component: CollectionsDocumentsComponent;
  let fixture: ComponentFixture<CollectionsDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionsDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
