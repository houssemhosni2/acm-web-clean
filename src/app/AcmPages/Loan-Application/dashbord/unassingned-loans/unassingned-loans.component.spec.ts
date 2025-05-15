import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnassingnedLoansComponent } from './unassingned-loans.component';

describe('UnassingnedLoansComponent', () => {
  let component: UnassingnedLoansComponent;
  let fixture: ComponentFixture<UnassingnedLoansComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnassingnedLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassingnedLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
