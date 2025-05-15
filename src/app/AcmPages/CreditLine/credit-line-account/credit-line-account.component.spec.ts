import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLineAccountComponent } from './credit-line-account.component';

describe('CreditLineAccountComponent', () => {
  let component: CreditLineAccountComponent;
  let fixture: ComponentFixture<CreditLineAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditLineAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLineAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
