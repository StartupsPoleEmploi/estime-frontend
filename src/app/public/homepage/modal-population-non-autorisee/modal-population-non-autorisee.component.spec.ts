import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPopulationNonAutoriseeComponent } from './modal-population-non-autorisee.component';

describe('ModalPopulationNonAutoriseeComponent', () => {
  let component: ModalPopulationNonAutoriseeComponent;
  let fixture: ComponentFixture<ModalPopulationNonAutoriseeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPopulationNonAutoriseeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPopulationNonAutoriseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
