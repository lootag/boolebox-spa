import { TestBed } from '@angular/core/testing';

import { SingnalingService } from './singnaling.service';

describe('SingnalingService', () => {
  let service: SingnalingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingnalingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
