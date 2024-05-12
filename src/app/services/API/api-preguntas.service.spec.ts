import { TestBed } from '@angular/core/testing';

import { APIPreguntasService } from '../API/api-preguntas.service';

describe('APIPreguntasService', () => {
  let service: APIPreguntasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIPreguntasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
