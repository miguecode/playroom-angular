import { TestBed } from '@angular/core/testing';

import { FirestoreUsuariosService } from './firestore-usuarios.service';

describe('FirestoreUsuariosService', () => {
  let service: FirestoreUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
