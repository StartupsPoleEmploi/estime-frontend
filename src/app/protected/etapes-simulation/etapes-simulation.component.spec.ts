import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapesSimulationComponent } from './etapes-simulation.component';

describe('EtapesSimulationComponent', () => {
  let component: EtapesSimulationComponent;
  let fixture: ComponentFixture<EtapesSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtapesSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapesSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
