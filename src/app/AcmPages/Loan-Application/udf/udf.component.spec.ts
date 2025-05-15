import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UdfComponent } from './udf.component';

describe('UdfComponent', () => {
  let component: UdfComponent;
  let fixture: ComponentFixture<UdfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
