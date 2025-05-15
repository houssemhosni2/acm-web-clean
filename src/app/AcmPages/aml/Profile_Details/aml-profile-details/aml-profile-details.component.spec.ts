import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileDetailsComponent } from './aml-profile-details.component';

describe('AmlProfileDetailsComponent', () => {
  let component: AmlProfileDetailsComponent;
  let fixture: ComponentFixture<AmlProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
