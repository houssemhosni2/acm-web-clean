import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileDetailsPdfVersionComponent } from './aml-profile-details-pdf-version.component';

describe('AmlProfileDetailsPdfVersionComponent', () => {
  let component: AmlProfileDetailsPdfVersionComponent;
  let fixture: ComponentFixture<AmlProfileDetailsPdfVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileDetailsPdfVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileDetailsPdfVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
