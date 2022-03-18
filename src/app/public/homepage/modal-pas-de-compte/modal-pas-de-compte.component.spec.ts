import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPasDeCompteComponent } from './modal-pas-de-compte.component';

describe('ModalPasDeCompteComponent', () => {
  let component: ModalPasDeCompteComponent;
  let fixture: ComponentFixture<ModalPasDeCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPasDeCompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPasDeCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
