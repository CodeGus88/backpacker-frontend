import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressReadOnlyComponent } from './address-read-only.component';

describe('AddressReadOnlyComponent', () => {
  let component: AddressReadOnlyComponent;
  let fixture: ComponentFixture<AddressReadOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressReadOnlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressReadOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
