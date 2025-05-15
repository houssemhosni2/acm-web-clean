import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCollectionValidationComponent } from './setting-collection-validation.component';

describe('SettingCollectionValidationComponent', () => {
  let component: SettingCollectionValidationComponent;
  let fixture: ComponentFixture<SettingCollectionValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingCollectionValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingCollectionValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
