import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ListDocumentsComponent} from './list-documents.component';

describe('ListDocumentsComponent', () => {
  let component: ListDocumentsComponent;
  let fixture: ComponentFixture<ListDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListDocumentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
