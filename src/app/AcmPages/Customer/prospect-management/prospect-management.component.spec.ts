import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectManagementComponent } from './prospect-management.component';

describe('ProspectManagementComponent', () => {
  let component: ProspectManagementComponent;
  let fixture: ComponentFixture<ProspectManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
