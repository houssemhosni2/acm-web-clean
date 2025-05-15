import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCollectionThirdPartyComponent } from './setting-collection-third-party.component';

describe('SettingCollectionThirdPartyComponent', () => {
  let component: SettingCollectionThirdPartyComponent;
  let fixture: ComponentFixture<SettingCollectionThirdPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingCollectionThirdPartyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingCollectionThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
