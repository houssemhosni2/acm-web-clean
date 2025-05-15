import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileSanctionsReferencesComponent } from './aml-profile-sanctions-references.component';

describe('AmlProfileSanctionsReferencesComponent', () => {
  let component: AmlProfileSanctionsReferencesComponent;
  let fixture: ComponentFixture<AmlProfileSanctionsReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileSanctionsReferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileSanctionsReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
