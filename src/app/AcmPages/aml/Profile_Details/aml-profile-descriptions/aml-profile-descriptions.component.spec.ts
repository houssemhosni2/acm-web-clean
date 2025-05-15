import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileDescriptionsComponent } from './aml-profile-descriptions.component';

describe('AmlProfileDescriptionsComponent', () => {
  let component: AmlProfileDescriptionsComponent;
  let fixture: ComponentFixture<AmlProfileDescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileDescriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
