import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalApproveListComponent } from './conditional-approve-list.component';

describe('ConditionalApproveListComponent', () => {
  let component: ConditionalApproveListComponent;
  let fixture: ComponentFixture<ConditionalApproveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionalApproveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalApproveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
