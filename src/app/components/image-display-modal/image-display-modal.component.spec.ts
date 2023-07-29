import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDisplayModalComponent } from './image-display-modal.component';

describe('ImageDisplayModalComponent', () => {
  let component: ImageDisplayModalComponent;
  let fixture: ComponentFixture<ImageDisplayModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageDisplayModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageDisplayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
