import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyHitsoryComponent } from './third-party-hitsory.component';

describe('ThirdPartyHitsoryComponent', () => {
  let component: ThirdPartyHitsoryComponent;
  let fixture: ComponentFixture<ThirdPartyHitsoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdPartyHitsoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyHitsoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
