import {TestBed} from '@angular/core/testing';

import {UnsplashApiService} from './unsplash-api.service';

describe('UnsplashApiService', () => {
  let service: UnsplashApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsplashApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
