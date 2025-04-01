import { Module } from '@nestjs/common';
import { CapitalRequestController } from './capital-request.controller';
import { CapitalRequestService } from './capital-request.service';

@Module({
  controllers: [CapitalRequestController],
  providers: [CapitalRequestService]
})
export class CapitalRequestModule {}
