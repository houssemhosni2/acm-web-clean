import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeFeeComponent } from './charge-fee.component';

describe('ChargeFeeComponent', () => {
  let component: ChargeFeeComponent;
  let fixture: ComponentFixture<ChargeFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
