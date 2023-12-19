import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoperComponent } from './poper.component';

describe('PoperComponent', () => {
  let component: PoperComponent;
  let fixture: ComponentFixture<PoperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
