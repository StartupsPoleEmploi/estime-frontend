import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateInputsComponent } from './date-inputs.component';

describe('DateInputsComponent', () => {
  let component: DateInputsComponent;
  let fixture: ComponentFixture<DateInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
