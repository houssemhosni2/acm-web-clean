import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNoteComponent } from './collection-note.component';

describe('CollectionNoteComponent', () => {
  let component: CollectionNoteComponent;
  let fixture: ComponentFixture<CollectionNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
