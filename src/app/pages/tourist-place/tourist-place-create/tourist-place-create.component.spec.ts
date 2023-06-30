import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristPlaceCreateComponent } from './tourist-place-create.component';

describe('TouristPlaceCreateComponent', () => {
  let component: TouristPlaceCreateComponent;
  let fixture: ComponentFixture<TouristPlaceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouristPlaceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristPlaceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
