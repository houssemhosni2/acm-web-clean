import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountInfoComponent } from './account-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AccountInfoComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccountInfoComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
