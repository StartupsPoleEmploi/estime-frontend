import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RessourcesFinancieresPersonnesAChargeComponent } from './ressources-financieres-personnes-a-charge.component';

describe('RessourcesFinancieresPersonnesAChargeComponent', () => {
  let component: RessourcesFinancieresPersonnesAChargeComponent;
  let fixture: ComponentFixture<RessourcesFinancieresPersonnesAChargeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RessourcesFinancieresPersonnesAChargeComponent]
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
