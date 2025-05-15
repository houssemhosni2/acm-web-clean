import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupRefinanceComponent } from './topup-refinance.component';

describe('TopupRefinanceComponent', () => {
  let component: TopupRefinanceComponent;
  let fixture: ComponentFixture<TopupRefinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopupRefinanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupRefinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
