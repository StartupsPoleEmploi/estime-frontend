import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonFuturTravailComponent } from './mon-futur-travail.component';

describe('MonFuturTravailComponent', () => {
  let component: MonFuturTravailComponent;
  let fixture: ComponentFixture<MonFuturTravailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonFuturTravailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonFuturTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
