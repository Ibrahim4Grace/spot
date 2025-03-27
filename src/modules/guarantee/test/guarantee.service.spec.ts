import { Test, TestingModule } from '@nestjs/testing';
import { GuaranteeService } from './guarantee.service';

describe('GuaranteeService', () => {
  let service: GuaranteeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuaranteeService],
    }).compile();

    service = module.get<GuaranteeService>(GuaranteeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
