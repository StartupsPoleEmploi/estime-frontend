import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccessibiliteComponent } from './accessibilite.component';

describe('AccessibiliteComponent', () => {
  let component: AccessibiliteComponent;
  let fixture: ComponentFixture<AccessibiliteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessibiliteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
