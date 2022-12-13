import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationCriteresComponent } from './modification-criteres.component';

describe('ModificationCriteresComponent', () => {
  let component: ModificationCriteresComponent;
  let fixture: ComponentFixture<ModificationCriteresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificationCriteresComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationCriteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
