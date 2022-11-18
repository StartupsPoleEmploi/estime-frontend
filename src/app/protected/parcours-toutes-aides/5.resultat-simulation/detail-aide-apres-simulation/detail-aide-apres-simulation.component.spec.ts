import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAideApresSimulationComponent } from './detail-aide-apres-simulation.component';

describe('DetailAideApresSimulationComponent', () => {
  let component: DetailAideApresSimulationComponent;
  let fixture: ComponentFixture<DetailAideApresSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAideApresSimulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAideApresSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
