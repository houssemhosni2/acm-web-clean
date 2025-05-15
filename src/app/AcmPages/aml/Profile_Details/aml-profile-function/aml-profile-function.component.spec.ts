import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileFunctionComponent } from './aml-profile-function.component';

describe('AmlProfileFunctionComponent', () => {
  let component: AmlProfileFunctionComponent;
  let fixture: ComponentFixture<AmlProfileFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileFunctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
