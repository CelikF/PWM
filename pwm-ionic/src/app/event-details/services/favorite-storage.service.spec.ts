import { TestBed } from '@angular/core/testing';

import { FavoriteStorageService } from './favorite-storage.service';

describe('FavoriteStorageService', () => {
  let service: FavoriteStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
