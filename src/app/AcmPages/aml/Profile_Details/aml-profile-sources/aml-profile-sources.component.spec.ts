import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlProfileSourcesComponent } from './aml-profile-sources.component';

describe('AmlProfileSourcesComponent', () => {
  let component: AmlProfileSourcesComponent;
  let fixture: ComponentFixture<AmlProfileSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlProfileSourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlProfileSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
