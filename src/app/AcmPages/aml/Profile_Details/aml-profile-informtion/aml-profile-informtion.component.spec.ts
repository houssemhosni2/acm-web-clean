import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileInformtionComponent } from './aml-profile-informtion.component';

describe('AmlProfileInformtionComponent', () => {
  let component: AmlProfileInformtionComponent;
  let fixture: ComponentFixture<AmlProfileInformtionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileInformtionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileInformtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
