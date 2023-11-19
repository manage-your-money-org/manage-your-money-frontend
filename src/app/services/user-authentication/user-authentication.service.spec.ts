import { TestBed } from '@angular/core/testing';

import { UserAuthenticationService } from './user-authentication.service';

describe('AuthenticationService', () => {
  let service: UserAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
