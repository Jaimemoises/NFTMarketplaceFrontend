import { TestBed } from '@angular/core/testing';

import { NFTMarketPlaceFormService } from './nftmarket-place-form.service';

describe('NFTMarketPlaceFormService', () => {
  let service: NFTMarketPlaceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NFTMarketPlaceFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
