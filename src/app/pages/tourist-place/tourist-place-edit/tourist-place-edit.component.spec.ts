import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPlaceEditComponent } from './tourist-place-edit.component';

describe('TouristPlaceEditComponent', () => {
  let component: TouristPlaceEditComponent;
  let fixture: ComponentFixture<TouristPlaceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouristPlaceEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristPlaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
