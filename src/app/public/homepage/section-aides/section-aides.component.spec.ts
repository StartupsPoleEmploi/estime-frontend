import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAidesComponent } from './section-aides.component';

describe('SectionAidesComponent', () => {
  let component: SectionAidesComponent;
  let fixture: ComponentFixture<SectionAidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionAidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionAidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
