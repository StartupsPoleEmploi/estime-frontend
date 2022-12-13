import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormPersonneAChargeSituationComponent } from './form-personne-a-charge-situation.component';

describe('FormPersonneAChargeSituationComponent', () => {
  let component: FormPersonneAChargeSituationComponent;
  let fixture: ComponentFixture<FormPersonneAChargeSituationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPersonneAChargeSituationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPersonneAChargeSituationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
