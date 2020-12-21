import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilEtapesSimulationComponent } from './fil-etapes-simulation.component';

describe('FilEtapesSimulationComponent', () => {
  let component: FilEtapesSimulationComponent;
  let fixture: ComponentFixture<FilEtapesSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilEtapesSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilEtapesSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
