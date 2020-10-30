import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInformationsIdentiteComponent } from './mes-informations-identite.component';

describe('MesInformationsIdentiteComponent', () => {
  let component: MesInformationsIdentiteComponent;
  let fixture: ComponentFixture<MesInformationsIdentiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesInformationsIdentiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesInformationsIdentiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
