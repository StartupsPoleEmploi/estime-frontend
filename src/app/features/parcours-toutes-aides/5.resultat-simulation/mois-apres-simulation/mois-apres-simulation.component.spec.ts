import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoisApresSimulationComponent } from './mois-apres-simulation.component';

describe('MoisApresSimulationComponent', () => {
  let component: MoisApresSimulationComponent;
  let fixture: ComponentFixture<MoisApresSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoisApresSimulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoisApresSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
