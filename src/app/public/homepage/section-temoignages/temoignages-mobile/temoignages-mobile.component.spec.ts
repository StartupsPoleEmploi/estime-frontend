import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemoignagesMobileComponent } from './temoignages-mobile.component';

describe('TemoignagesMobileComponent', () => {
  let component: TemoignagesMobileComponent;
  let fixture: ComponentFixture<TemoignagesMobileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemoignagesMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemoignagesMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
