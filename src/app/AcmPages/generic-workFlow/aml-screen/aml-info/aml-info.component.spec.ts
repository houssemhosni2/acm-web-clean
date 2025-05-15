import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlInfoComponent } from './aml-info.component';

describe('AmlInfoComponent', () => {
  let component: AmlInfoComponent;
  let fixture: ComponentFixture<AmlInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
