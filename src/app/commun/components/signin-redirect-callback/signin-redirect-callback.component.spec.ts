import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SigninRedirectCallbackComponent } from './signin-redirect-callback.component';

describe('SigninRedirectCallbackComponent', () => {
  let component: SigninRedirectCallbackComponent;
  let fixture: ComponentFixture<SigninRedirectCallbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninRedirectCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninRedirectCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
