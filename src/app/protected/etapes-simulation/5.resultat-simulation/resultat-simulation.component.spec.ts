import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatSimulationComponent } from './resultat-simulation.component';

describe('ResultatSimulationComponent', () => {
  let component: ResultatSimulationComponent;
  let fixture: ComponentFixture<ResultatSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultatSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
