import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntryTypeComponent } from './journal-entry-type.component';

describe('JournalEntryTypeComponent', () => {
  let component: JournalEntryTypeComponent;
  let fixture: ComponentFixture<JournalEntryTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalEntryTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalEntryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
