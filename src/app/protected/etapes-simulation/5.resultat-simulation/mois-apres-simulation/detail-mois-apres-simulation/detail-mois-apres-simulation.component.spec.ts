import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMoisApresSimulationComponent } from './detail-mois-apres-simulation.component';

describe('DetailMoisApresSimulationComponent', () => {
  let component: DetailMoisApresSimulationComponent;
  let fixture: ComponentFixture<DetailMoisApresSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMoisApresSimulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMoisApresSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
