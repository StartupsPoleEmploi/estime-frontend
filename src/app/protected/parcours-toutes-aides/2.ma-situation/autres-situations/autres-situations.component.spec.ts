import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutresSituationsComponent } from './autres-situations.component';

describe('AutresSituationsComponent', () => {
  let component: AutresSituationsComponent;
  let fixture: ComponentFixture<AutresSituationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutresSituationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutresSituationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
