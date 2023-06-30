import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPlaceViewComponent } from './tourist-place-view.component';

describe('TouristPlaceViewComponent', () => {
  let component: TouristPlaceViewComponent;
  let fixture: ComponentFixture<TouristPlaceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouristPlaceViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristPlaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
