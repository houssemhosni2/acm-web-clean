import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExceptionRequestComponent } from './exception-request.component';

describe('ExceptionRequestComponent', () => {
  let component: ExceptionRequestComponent;
  let fixture: ComponentFixture<ExceptionRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceptionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
