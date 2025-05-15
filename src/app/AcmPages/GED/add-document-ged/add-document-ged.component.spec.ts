import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AddDocumentGedComponent} from './add-document-ged.component';

describe('AddDocumentGedComponent', () => {
  let component: AddDocumentGedComponent;
  let fixture: ComponentFixture<AddDocumentGedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddDocumentGedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentGedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
