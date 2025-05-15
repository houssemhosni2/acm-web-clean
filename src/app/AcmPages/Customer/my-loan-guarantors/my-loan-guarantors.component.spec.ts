import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyLoanGuarantorsComponent } from './my-loan-guarantors.component';

describe('MyLoanGuarantorsComponent', () => {
  let component: MyLoanGuarantorsComponent;
  let fixture: ComponentFixture<MyLoanGuarantorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLoanGuarantorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLoanGuarantorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
