import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MotifsRejetComponent } from './motifs-rejet.component';

describe('MotifsRejetComponent', () => {
  let component: MotifsRejetComponent;
  let fixture: ComponentFixture<MotifsRejetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MotifsRejetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotifsRejetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
