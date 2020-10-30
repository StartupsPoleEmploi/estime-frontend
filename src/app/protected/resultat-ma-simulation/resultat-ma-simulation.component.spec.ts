import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatMaSimulationComponent } from './resultat-ma-simulation.component';

describe('ResultatMaSimulationComponent', () => {
  let component: ResultatMaSimulationComponent;
  let fixture: ComponentFixture<ResultatMaSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultatMaSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatMaSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
