import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RenewalConditionSettingsComponent } from './renewal-condition-settings.component';

describe('RenewalConditionSettingsComponent', () => {
  let component: RenewalConditionSettingsComponent;
  let fixture: ComponentFixture<RenewalConditionSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalConditionSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalConditionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
