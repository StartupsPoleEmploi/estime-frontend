import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContratTravailComponent } from './contrat-travail.component';

describe('MonFuturTravailComponent', () => {
  let component: ContratTravailComponent;
  let fixture: ComponentFixture<ContratTravailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratTravailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
