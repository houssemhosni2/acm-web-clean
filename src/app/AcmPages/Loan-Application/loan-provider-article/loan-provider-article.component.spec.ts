import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanProviderArticleComponent } from './loan-provider-article.component';

describe('LoanProviderArticleComponent', () => {
  let component: LoanProviderArticleComponent;
  let fixture: ComponentFixture<LoanProviderArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanProviderArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanProviderArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
