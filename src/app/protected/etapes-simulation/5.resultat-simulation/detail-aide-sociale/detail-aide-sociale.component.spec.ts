import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAideSocialeComponent } from './detail-aide-sociale.component';

describe('DetailAideSocialeComponent', () => {
  let component: DetailAideSocialeComponent;
  let fixture: ComponentFixture<DetailAideSocialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAideSocialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAideSocialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
