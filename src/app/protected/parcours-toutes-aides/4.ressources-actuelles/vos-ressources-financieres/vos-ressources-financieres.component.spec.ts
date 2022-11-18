import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VosRessourcesFinancieresComponent } from './vos-ressources-financieres.component';

describe('VosRessourcesFinancieresComponent', () => {
  let component: VosRessourcesFinancieresComponent;
  let fixture: ComponentFixture<VosRessourcesFinancieresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VosRessourcesFinancieresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VosRessourcesFinancieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
