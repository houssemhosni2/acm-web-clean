import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordWfComponent } from './dashbord-wf.component';

describe('DashbordWfComponent', () => {
  let component: DashbordWfComponent;
  let fixture: ComponentFixture<DashbordWfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordWfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbordWfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
