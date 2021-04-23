import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormPersonneAChargeComponent } from './form-personne-a-charge.component';

describe('FormPersonneAChargeComponent', () => {
  let component: FormPersonneAChargeComponent;
  let fixture: ComponentFixture<FormPersonneAChargeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPersonneAChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPersonneAChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
