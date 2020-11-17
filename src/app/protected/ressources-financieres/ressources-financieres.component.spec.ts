import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourcesFinancieresComponent } from './ressources-financieres.component';

describe('RessourcesFinancieresComponent', () => {
  let component: RessourcesFinancieresComponent;
  let fixture: ComponentFixture<RessourcesFinancieresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RessourcesFinancieresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourcesFinancieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
