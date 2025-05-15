/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBusinessContributionComponent } from './supplier-business-contribution.component';

describe('SupplierBusinessContributionComponent', () => {
  let component: SupplierBusinessContributionComponent;
  let fixture: ComponentFixture<SupplierBusinessContributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierBusinessContributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBusinessContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
