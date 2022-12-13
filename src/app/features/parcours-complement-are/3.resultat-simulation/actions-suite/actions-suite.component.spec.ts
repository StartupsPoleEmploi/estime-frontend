import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsSuiteComponent } from './actions-suite.component';

describe('ActionsSuiteComponent', () => {
  let component: ActionsSuiteComponent;
  let fixture: ComponentFixture<ActionsSuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionsSuiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
