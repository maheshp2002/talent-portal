import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineExamLandingComponent } from './online-exam-landing.component';

describe('OnlineExamLandingComponent', () => {
  let component: OnlineExamLandingComponent;
  let fixture: ComponentFixture<OnlineExamLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineExamLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineExamLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
