import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourcesFinancieresPersonnesAChargeComponent } from './ressources-financieres-personnes-a-charge.component';

describe('RessourcesFinancieresPersonnesAChargeComponent', () => {
  let component: RessourcesFinancieresPersonnesAChargeComponent;
  let fixture: ComponentFixture<RessourcesFinancieresPersonnesAChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RessourcesFinancieresPersonnesAChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourcesFinancieresPersonnesAChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
