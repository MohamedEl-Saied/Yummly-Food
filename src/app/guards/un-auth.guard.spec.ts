import { TestBed } from '@angular/core/testing';

import { UnAuthGuard } from './un-auth.guard';

describe('UnAuthGuard', () => {
  let guard: UnAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UnAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
