import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesRessourcesFinancieresComponent } from './mes-ressources-financieres.component';

describe('MesRessourcesFinancieresComponent', () => {
  let component: MesRessourcesFinancieresComponent;
  let fixture: ComponentFixture<MesRessourcesFinancieresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesRessourcesFinancieresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesRessourcesFinancieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
