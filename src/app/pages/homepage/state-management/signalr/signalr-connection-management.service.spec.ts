import { TestBed } from '@angular/core/testing';

import { SignalrConnectionManagementService } from './signalr-connection-management.service';

describe('SignalrConnectionManagementService', () => {
  let service: SignalrConnectionManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrConnectionManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
