import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RessourcesFinancieresFoyerComponent } from './ressources-financieres-foyer.component';

describe('RessourcesFinancieresFoyerComponent', () => {
  let component: RessourcesFinancieresFoyerComponent;
  let fixture: ComponentFixture<RessourcesFinancieresFoyerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RessourcesFinancieresFoyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourcesFinancieresFoyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
