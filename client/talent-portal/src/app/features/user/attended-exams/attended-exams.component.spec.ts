import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendedExamsComponent } from './attended-exams.component';

describe('AttendedExamsComponent', () => {
  let component: AttendedExamsComponent;
  let fixture: ComponentFixture<AttendedExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendedExamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendedExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
