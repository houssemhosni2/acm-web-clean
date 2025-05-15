import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerAnalyseComponent } from './customer-analyse.component';

describe('CustomerAnalyseComponent', () => {
  let component: CustomerAnalyseComponent;
  let fixture: ComponentFixture<CustomerAnalyseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAnalyseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
