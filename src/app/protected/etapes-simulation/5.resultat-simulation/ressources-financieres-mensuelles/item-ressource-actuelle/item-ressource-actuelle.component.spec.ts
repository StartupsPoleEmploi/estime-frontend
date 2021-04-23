import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemRessourceActuelleComponent } from './item-ressource-actuelle.component';

describe('ItemRessourceActuelleComponent', () => {
  let component: ItemRessourceActuelleComponent;
  let fixture: ComponentFixture<ItemRessourceActuelleComponent>;

  beforeEach(waitForAsync(() => {
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
