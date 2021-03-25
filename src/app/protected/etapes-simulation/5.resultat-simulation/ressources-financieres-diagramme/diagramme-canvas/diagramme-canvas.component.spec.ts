import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagrammeCanvasComponent } from './diagramme-canvas.component';

describe('DiagrammeCanvasComponent', () => {
  let component: DiagrammeCanvasComponent;
  let fixture: ComponentFixture<DiagrammeCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagrammeCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagrammeCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
