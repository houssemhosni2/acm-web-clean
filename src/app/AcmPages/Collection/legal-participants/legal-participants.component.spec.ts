import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalParticipantsComponent } from './legal-participants.component';

describe('LegalParticipantsComponent', () => {
  let component: LegalParticipantsComponent;
  let fixture: ComponentFixture<LegalParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalParticipantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
