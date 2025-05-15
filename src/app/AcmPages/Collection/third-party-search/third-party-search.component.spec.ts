import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartySearchComponent } from './third-party-search.component';

describe('ThirdPartySearchComponent', () => {
  let component: ThirdPartySearchComponent;
  let fixture: ComponentFixture<ThirdPartySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdPartySearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
