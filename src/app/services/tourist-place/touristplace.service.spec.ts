import { TestBed } from '@angular/core/testing';

import { TouristplaceService } from '../touristplace/touristplace.service';

describe('TouristplaceService', () => {
  let service: TouristplaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouristplaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
