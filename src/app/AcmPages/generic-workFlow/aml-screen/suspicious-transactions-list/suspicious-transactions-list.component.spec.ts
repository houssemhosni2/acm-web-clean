import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspiciousTransactionsListComponent } from './suspicious-transactions-list.component';

describe('SuspiciousTransactionsListComponent', () => {
  let component: SuspiciousTransactionsListComponent;
  let fixture: ComponentFixture<SuspiciousTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspiciousTransactionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspiciousTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
