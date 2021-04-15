import { TestBed } from '@angular/core/testing';

import { IceService } from './ice.service';

describe('IceService', () => {
  let service: IceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
