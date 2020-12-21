import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaSituationComponent } from './ma-situation.component';

describe('MaSituationComponent', () => {
  let component: MaSituationComponent;
  let fixture: ComponentFixture<MaSituationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaSituationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaSituationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
