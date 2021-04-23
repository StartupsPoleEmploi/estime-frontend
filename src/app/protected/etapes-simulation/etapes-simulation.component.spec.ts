import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EtapesSimulationComponent } from './etapes-simulation.component';

describe('EtapesSimulationComponent', () => {
  let component: EtapesSimulationComponent;
  let fixture: ComponentFixture<EtapesSimulationComponent>;

  beforeEach(waitForAsync(() => {
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
