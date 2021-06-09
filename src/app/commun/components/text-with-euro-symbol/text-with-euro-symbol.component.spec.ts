import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextWithEuroSymbolComponent } from './text-with-euro-symbol.component';

describe('TextWithEuroSymbolComponent', () => {
  let component: TextWithEuroSymbolComponent;
  let fixture: ComponentFixture<TextWithEuroSymbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextWithEuroSymbolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextWithEuroSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
