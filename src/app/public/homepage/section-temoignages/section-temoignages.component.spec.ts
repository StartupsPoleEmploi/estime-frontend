import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SectionTemoignagesComponent } from './section-temoignages.component';

describe('SectionTemoignagesComponent', () => {
  let component: SectionTemoignagesComponent;
  let fixture: ComponentFixture<SectionTemoignagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionTemoignagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionTemoignagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
