import { Module } from '@nestjs/common';
import { GuaranteeService } from './guarantee.service';
import { GuaranteeController } from './guarantee.controller';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guarantee } from './entities/guarantee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guarantee])],
  providers: [GuaranteeService, Repository],
  controllers: [GuaranteeController],
  exports: [GuaranteeService],
})
export class GuaranteeModule {}
