import { TestBed } from '@angular/core/testing';

import { AntmediaManagementService } from './antmedia-management.service';

describe('AntmediaManagementService', () => {
  let service: AntmediaManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntmediaManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
