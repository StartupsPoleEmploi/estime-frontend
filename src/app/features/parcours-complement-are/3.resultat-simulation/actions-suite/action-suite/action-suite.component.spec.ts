import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSuiteComponent } from './action-suite.component';

describe('ActionSuiteComponent', () => {
  let component: ActionSuiteComponent;
  let fixture: ComponentFixture<ActionSuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionSuiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
