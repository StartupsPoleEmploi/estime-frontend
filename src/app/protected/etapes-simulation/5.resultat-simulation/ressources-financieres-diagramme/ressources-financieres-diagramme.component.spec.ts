import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourcesFinancieresDiagrammeComponent } from './ressources-financieres-diagramme.component';

describe('RessourcesFinancieresDiagrammeComponent', () => {
  let component: RessourcesFinancieresDiagrammeComponent;
  let fixture: ComponentFixture<RessourcesFinancieresDiagrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RessourcesFinancieresDiagrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourcesFinancieresDiagrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
