import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilEtapesDesktopComponent } from './fil-etapes-desktop.component';

describe('FilEtapesDesktopComponent', () => {
  let component: FilEtapesDesktopComponent;
  let fixture: ComponentFixture<FilEtapesDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilEtapesDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilEtapesDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
