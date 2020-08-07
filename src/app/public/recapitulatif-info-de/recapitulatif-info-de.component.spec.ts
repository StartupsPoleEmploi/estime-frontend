import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapitulatifInfoDeComponent } from './recapitulatif-info-de.component';

describe('RecapitulatifInfoDeComponent', () => {
  let component: RecapitulatifInfoDeComponent;
  let fixture: ComponentFixture<RecapitulatifInfoDeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapitulatifInfoDeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapitulatifInfoDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
