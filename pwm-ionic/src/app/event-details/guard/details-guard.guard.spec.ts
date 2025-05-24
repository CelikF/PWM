import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { DetailsGuard } from './details-guard.guard';

describe('detailsGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => DetailsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
