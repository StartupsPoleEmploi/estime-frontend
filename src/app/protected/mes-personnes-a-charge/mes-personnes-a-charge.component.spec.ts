import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesPersonnesAChargeComponent } from './mes-personnes-a-charge.component';

describe('MesPersonnesAChargeComponent', () => {
  let component: MesPersonnesAChargeComponent;
  let fixture: ComponentFixture<MesPersonnesAChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesPersonnesAChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesPersonnesAChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
