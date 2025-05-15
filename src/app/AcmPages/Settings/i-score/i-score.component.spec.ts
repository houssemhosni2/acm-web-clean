import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IScoreComponent } from './i-score.component';

describe('IScoreComponent', () => {
  let component: IScoreComponent;
  let fixture: ComponentFixture<IScoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
