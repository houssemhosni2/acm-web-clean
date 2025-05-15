import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileNoteComponent } from './aml-profile-note.component';

describe('AmlProfileNoteComponent', () => {
  let component: AmlProfileNoteComponent;
  let fixture: ComponentFixture<AmlProfileNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
