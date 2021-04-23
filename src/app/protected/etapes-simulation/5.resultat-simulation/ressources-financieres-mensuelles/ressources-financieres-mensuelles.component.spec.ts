import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RessourcesFinancieresMensuellesComponent } from './ressources-financieres-mensuelles.component';

describe('RessourcesFinancieresMensuellesComponent', () => {
  let component: RessourcesFinancieresMensuellesComponent;
  let fixture: ComponentFixture<RessourcesFinancieresMensuellesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RessourcesFinancieresMensuellesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourcesFinancieresMensuellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
