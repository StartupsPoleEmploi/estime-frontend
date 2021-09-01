import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidesComponent } from './aides.component';

describe('AidesComponent', () => {
  let component: AidesComponent;
  let fixture: ComponentFixture<AidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
