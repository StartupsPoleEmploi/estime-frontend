import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilEtapesMobileComponent } from './fil-etapes-mobile.component';

describe('FilEtapesMobileComponent', () => {
  let component: FilEtapesMobileComponent;
  let fixture: ComponentFixture<FilEtapesMobileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilEtapesMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilEtapesMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
