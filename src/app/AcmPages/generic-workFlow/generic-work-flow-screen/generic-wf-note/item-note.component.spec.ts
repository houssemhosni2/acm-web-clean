import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNoteComponent } from './item-note.component';

describe('CollectionNoteComponent', () => {
  let component: ItemNoteComponent;
  let fixture: ComponentFixture<ItemNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
