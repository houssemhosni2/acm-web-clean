import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AddDocumentsProcessComponent} from './add-documents-process.component';

describe('AddDocumentsProcessComponent', () => {
  let component: AddDocumentsProcessComponent;
  let fixture: ComponentFixture<AddDocumentsProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddDocumentsProcessComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentsProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
