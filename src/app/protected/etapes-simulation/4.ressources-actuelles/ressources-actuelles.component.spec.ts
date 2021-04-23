import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RessourcesFinancieresComponent } from './ressources-actuelles.component';

describe('RessourcesFinancieresComponent', () => {
  let component: RessourcesFinancieresComponent;
  let fixture: ComponentFixture<RessourcesFinancieresComponent>;

  beforeEach(waitForAsync(() => {
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
