import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalApproveComponent } from './conditional-approve.component';

describe('ConditionalApproveComponent', () => {
  let component: ConditionalApproveComponent;
  let fixture: ComponentFixture<ConditionalApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionalApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
