import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RessourcesFinancieresConjointComponent } from './ressources-financieres-conjoint.component';

describe('RessourcesFinancieresConjointComponent', () => {
  let component: RessourcesFinancieresConjointComponent;
  let fixture: ComponentFixture<RessourcesFinancieresConjointComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RessourcesFinancieresConjointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourcesFinancieresConjointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
