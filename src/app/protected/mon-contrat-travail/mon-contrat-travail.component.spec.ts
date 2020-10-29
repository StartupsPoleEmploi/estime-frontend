import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonContratTravailComponent } from './mon-contrat-travail.component';

describe('MonContratTravailComponent', () => {
  let component: MonContratTravailComponent;
  let fixture: ComponentFixture<MonContratTravailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonContratTravailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonContratTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
