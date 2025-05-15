import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLineAddComponent } from './credit-line-add.component';

describe('CreditLineAddComponent', () => {
  let component: CreditLineAddComponent;
  let fixture: ComponentFixture<CreditLineAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditLineAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLineAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
