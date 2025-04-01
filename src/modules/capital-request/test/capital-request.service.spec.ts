import { Test, TestingModule } from '@nestjs/testing';
import { CapitalRequestService } from './capital-request.service';

describe('CapitalRequestService', () => {
  let service: CapitalRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapitalRequestService],
    }).compile();

    service = module.get<CapitalRequestService>(CapitalRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
