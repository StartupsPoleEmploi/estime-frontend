import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MettreAJourProfilComponent } from './mettre-a-jour-profil.component';

describe('MettreAJourProfilComponent', () => {
  let component: MettreAJourProfilComponent;
  let fixture: ComponentFixture<MettreAJourProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MettreAJourProfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MettreAJourProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
