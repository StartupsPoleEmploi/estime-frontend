import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRessourceActuelleComponent } from './item-ressource-actuelle.component';

describe('ItemRessourceActuelleComponent', () => {
  let component: ItemRessourceActuelleComponent;
  let fixture: ComponentFixture<ItemRessourceActuelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRessourceActuelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRessourceActuelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
