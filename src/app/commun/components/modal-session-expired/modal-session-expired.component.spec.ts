import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSessionExpiredComponent } from './modal-session-expired.component';

describe('ModalSessionExpiredComponent', () => {
  let component: ModalSessionExpiredComponent;
  let fixture: ComponentFixture<ModalSessionExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSessionExpiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSessionExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
