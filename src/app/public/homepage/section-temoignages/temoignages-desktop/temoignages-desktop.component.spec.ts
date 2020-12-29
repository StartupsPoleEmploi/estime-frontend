import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemoignagesDesktopComponent } from './temoignages-desktop.component';

describe('TemoignagesDesktopComponent', () => {
  let component: TemoignagesDesktopComponent;
  let fixture: ComponentFixture<TemoignagesDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemoignagesDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemoignagesDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
