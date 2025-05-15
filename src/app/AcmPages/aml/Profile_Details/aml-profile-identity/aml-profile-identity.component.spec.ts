import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileIdentityComponent } from './aml-profile-identity.component';

describe('AmlProfileIdentityComponent', () => {
  let component: AmlProfileIdentityComponent;
  let fixture: ComponentFixture<AmlProfileIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileIdentityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
