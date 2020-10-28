import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvantDeCommencerSimulationComponent } from './avant-de-commencer-simulation.component';

describe('AvantDeCommencerSimulationComponent', () => {
  let component: AvantDeCommencerSimulationComponent;
  let fixture: ComponentFixture<AvantDeCommencerSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvantDeCommencerSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvantDeCommencerSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
