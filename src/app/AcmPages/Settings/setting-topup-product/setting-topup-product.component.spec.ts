import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTopupProductComponent } from './setting-topup-product.component';

describe('SettingTopupProductComponent', () => {
  let component: SettingTopupProductComponent;
  let fixture: ComponentFixture<SettingTopupProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingTopupProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingTopupProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
