import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAvantDeCommencerComponent } from './documents-avant-de-commencer.component';

describe('DocumentsAvantDeCommencerComponent', () => {
  let component: DocumentsAvantDeCommencerComponent;
  let fixture: ComponentFixture<DocumentsAvantDeCommencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsAvantDeCommencerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAvantDeCommencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
