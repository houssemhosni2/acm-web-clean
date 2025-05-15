import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IssuedLoansComponent } from './issued-loans.component';

describe('IssuedLoansComponent', () => {
  let component: IssuedLoansComponent;
  let fixture: ComponentFixture<IssuedLoansComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuedLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuedLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
