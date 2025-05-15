import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExceptionRequestTableComponent } from './exception-request-table.component';

describe('ExceptionRequestTableComponent', () => {
  let component: ExceptionRequestTableComponent;
  let fixture: ComponentFixture<ExceptionRequestTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceptionRequestTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionRequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
