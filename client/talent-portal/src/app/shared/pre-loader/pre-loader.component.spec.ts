import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLoaderComponent } from './pre-loader.component';

describe('PreLoaderComponent', () => {
  let component: PreLoaderComponent;
  let fixture: ComponentFixture<PreLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
