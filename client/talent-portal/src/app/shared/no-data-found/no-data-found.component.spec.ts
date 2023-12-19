import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataFoundComponent } from './no-data-found.component';

describe('NoDataFoundComponent', () => {
  let component: NoDataFoundComponent;
  let fixture: ComponentFixture<NoDataFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NoDataFoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoDataFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
