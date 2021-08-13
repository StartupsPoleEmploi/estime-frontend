import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationOffresComponent } from './consultation-offres.component';

describe('ConsultationOffresComponent', () => {
  let component: ConsultationOffresComponent;
  let fixture: ComponentFixture<ConsultationOffresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationOffresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationOffresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
