import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidesCarteHeadersComponent } from './aides-carte-headers.component';

describe('AidesCarteHeadersComponent', () => {
  let component: AidesCarteHeadersComponent;
  let fixture: ComponentFixture<AidesCarteHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AidesCarteHeadersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AidesCarteHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
