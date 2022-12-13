import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteRepriseComponent } from './activite-reprise.component';

describe('ActiviteRepriseComponent', () => {
  let component: ActiviteRepriseComponent;
  let fixture: ComponentFixture<ActiviteRepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiviteRepriseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteRepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
