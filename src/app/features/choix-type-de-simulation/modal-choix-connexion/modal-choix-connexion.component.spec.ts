import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixConnexionComponent } from './modal-choix-connexion.component';

describe('ModalChoixConnexionComponent', () => {
  let component: ModalChoixConnexionComponent;
  let fixture: ComponentFixture<ModalChoixConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixConnexionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChoixConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
