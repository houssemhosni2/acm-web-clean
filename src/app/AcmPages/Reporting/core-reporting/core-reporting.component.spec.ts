import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreReportingComponent } from './core-reporting.component';

describe('CoreReportingComponent', () => {
  let component: CoreReportingComponent;
  let fixture: ComponentFixture<CoreReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
