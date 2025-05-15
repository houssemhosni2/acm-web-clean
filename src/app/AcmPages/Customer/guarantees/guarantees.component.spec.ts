import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuaranteesComponent } from './guarantees.component';

describe('GuaranteesComponent', () => {
  let component: GuaranteesComponent;
  let fixture: ComponentFixture<GuaranteesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
