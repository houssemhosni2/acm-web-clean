import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesSettingComponent } from './branches-setting.component';

describe('BranchesSettingComponent', () => {
  let component: BranchesSettingComponent;
  let fixture: ComponentFixture<BranchesSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchesSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
