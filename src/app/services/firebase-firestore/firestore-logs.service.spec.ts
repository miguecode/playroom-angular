import { TestBed } from '@angular/core/testing';

import { FirestoreLogsService } from './firestore-logs.service';

describe('FirestoreLogsService', () => {
  let service: FirestoreLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
