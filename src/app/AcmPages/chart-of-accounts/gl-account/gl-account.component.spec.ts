import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlAccountComponent } from './gl-account.component';

describe('GlAccountComponent', () => {
  let component: GlAccountComponent;
  let fixture: ComponentFixture<GlAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
