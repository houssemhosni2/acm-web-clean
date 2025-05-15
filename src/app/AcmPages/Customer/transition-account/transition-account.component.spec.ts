import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionAccountComponent } from './transition-account.component';

describe('TransitionAccountComponent', () => {
  let component: TransitionAccountComponent;
  let fixture: ComponentFixture<TransitionAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransitionAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
