import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInformationsPersonnellesComponent } from './mes-informations-personnelles.component';

describe('MesInformationsIdentiteComponent', () => {
  let component: MesInformationsPersonnellesComponent;
  let fixture: ComponentFixture<MesInformationsPersonnellesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesInformationsPersonnellesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesInformationsPersonnellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
