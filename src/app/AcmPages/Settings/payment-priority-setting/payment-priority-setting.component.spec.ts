import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPrioritySettingComponent } from './payment-priority-setting.component';

describe('PaymentPrioritySettingComponent', () => {
  let component: PaymentPrioritySettingComponent;
  let fixture: ComponentFixture<PaymentPrioritySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPrioritySettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPrioritySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
