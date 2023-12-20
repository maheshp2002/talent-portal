import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllJobComponent } from './view-all-job.component';

describe('ViewAllJobComponent', () => {
  let component: ViewAllJobComponent;
  let fixture: ComponentFixture<ViewAllJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllJobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
