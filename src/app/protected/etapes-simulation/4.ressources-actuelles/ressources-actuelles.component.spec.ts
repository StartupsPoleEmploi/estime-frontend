import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RessourcesActuellesComponent } from './ressources-actuelles.component';

describe('RessourcesFinancieresComponent', () => {
  let component: RessourcesActuellesComponent;
  let fixture: ComponentFixture<RessourcesActuellesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RessourcesActuellesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourcesActuellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
