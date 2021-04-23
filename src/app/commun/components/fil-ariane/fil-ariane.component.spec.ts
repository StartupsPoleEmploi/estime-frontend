import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilArianeComponent } from './fil-ariane.component';

describe('FilArianeComponent', () => {
  let component: FilArianeComponent;
  let fixture: ComponentFixture<FilArianeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilArianeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilArianeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
