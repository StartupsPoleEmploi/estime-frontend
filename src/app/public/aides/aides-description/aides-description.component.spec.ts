import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidesDescriptionComponent } from './aides-description.component';

describe('AidesDescriptionComponent', () => {
  let component: AidesDescriptionComponent;
  let fixture: ComponentFixture<AidesDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AidesDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AidesDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
