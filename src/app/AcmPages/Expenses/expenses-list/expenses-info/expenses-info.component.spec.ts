import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpensesInfoComponent } from './expenses-info.component';

describe('ExpensesInfoComponent', () => {
  let component: ExpensesInfoComponent;
  let fixture: ComponentFixture<ExpensesInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
