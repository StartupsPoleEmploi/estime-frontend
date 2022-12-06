import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixTypeDeSimulationComponent } from './choix-type-de-simulation.component';

describe('ChoixTypeDeSimulationComponent', () => {
  let component: ChoixTypeDeSimulationComponent;
  let fixture: ComponentFixture<ChoixTypeDeSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoixTypeDeSimulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoixTypeDeSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
