import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HabilitationComponent } from './habilitation.component';

describe('HabilitationComponent', () => {
  let component: HabilitationComponent;
  let fixture: ComponentFixture<HabilitationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
