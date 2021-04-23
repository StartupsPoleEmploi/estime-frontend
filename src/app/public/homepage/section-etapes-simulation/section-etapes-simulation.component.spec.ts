import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SectionEtapesSimulationComponent } from './section-etapes-simulation.component';

describe('SectionEtapesSimulationComponent', () => {
  let component: SectionEtapesSimulationComponent;
  let fixture: ComponentFixture<SectionEtapesSimulationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionEtapesSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionEtapesSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
