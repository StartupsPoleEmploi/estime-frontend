import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SectionQuestionsComponent } from './section-questions.component';

describe('SectionQuestionsComponent', () => {
  let component: SectionQuestionsComponent;
  let fixture: ComponentFixture<SectionQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
