import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionAtelierComponent } from './inscription-atelier.component';

describe('InscriptionAtelierComponent', () => {
  let component: InscriptionAtelierComponent;
  let fixture: ComponentFixture<InscriptionAtelierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscriptionAtelierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InscriptionAtelierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
